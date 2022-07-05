import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { parseUnits } from 'ethers/lib/utils.js';
import { noTryAsync } from 'no-try';
import { getApiUrl } from '..';

export const whitelistCollection = async (address: string) => {
	const [err, res] = await noTryAsync(() => axios.post(getApiUrl('latest', 'collections/crawl-collection'), { address }, getAxiosConfig()));

	if (err) {
		notifyError('Failed to whitelist collection');
		throw new Error('Failed to whitelist collection');
	}

	const factoryContract = getContract('factory');

	let royalties = [];

	royalties = res.data.data.royalties;
	
	let beneficiaries = royalties.length > 0 ? royalties.map((item) => item.address) : ['0x0000000000000000000000000000000000000000'];
	let percentages = royalties.length > 0 ? royalties.map((item) => parseUnits(item.fees.toString(), 2)) : [parseUnits('0', 2)];

	await contractCaller(factoryContract, 'register', 150, 1, res.data.data.collectionAddress, beneficiaries, percentages);

	return res.data.data;
};
