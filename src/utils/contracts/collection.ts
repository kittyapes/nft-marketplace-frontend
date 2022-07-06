import contractCaller from './contractCaller';
import { parseUnits } from 'ethers/lib/utils.js';
import { getContract } from '$utils/misc/getContract';

export async function contractCreateCollection(options: {
	royalties: {
		fees: string | number;
		address: string;
		createdAt?: string;
	}[];
	name: string;
	paymentTokenTicker: string;
	slug: string;
}) {
	const contract = getContract('factory');
	options.royalties = options.royalties.filter((item) => item.fees && item.address);

	const res = await contractCaller(
		contract,
		'spawn',
		150,
		1,
		options.name,
		options.paymentTokenTicker,
		options.slug,
		options.royalties.length > 0 ? options.royalties.map((item) => item.address) : ['0x0000000000000000000000000000000000000000'],
		options.royalties.length > 0 ? options.royalties.map((item) => parseUnits(item.fees.toString(), 2)) : [parseUnits('0', 2)],
		false
	);

	return { contractAddress: res.events[0].args[2] };
}
