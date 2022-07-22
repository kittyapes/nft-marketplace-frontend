import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import { noTryAsync } from 'no-try';
import { getApiUrl } from '..';

export const whitelistCollection = async (address: string, slug: string) => {
	
	const res = await axios.get('https://api.opensea.io/api/v1/collection' + slug);

	const factoryContract = getContract('factory');

	let royalties = [{ fees: res.data.data.metadata.dev_seller_fee_basis_points / 10, address: res.data.data.metadata.payout_address }];

	let beneficiaries = royalties.length > 0 ? royalties.map((item) => item.address) : ['0x0000000000000000000000000000000000000000'];
	let percentages = royalties.length > 0 ? royalties.map((item) => ethers.utils.parseUnits(item.fees.toString(), 2)) : [ethers.utils.parseUnits('0', 2)];

	await contractCaller(factoryContract, 'register', 150, 1, res.data.data.collectionAddress, beneficiaries, percentages).catch(() => notifyError('Failed to whitelist collection on-chain'));

	const [err, apiRes] = await noTryAsync(async () => axios.post(getApiUrl('latest', 'collections/crawl-collection'), { address }, await getAxiosConfig()));
	if (err) {
		notifyError('Failed to whitelist collection');
		throw new Error('Failed to whitelist collection');
	}

	return apiRes.data.data;
};
