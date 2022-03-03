import { api } from '$constants/api';
import axios from 'axios';

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function hasClaimedFreeNft(address: string) {
	const res = await axios.get(`${api}/v1/nfts/isClaimed/${address}`);

	return res.data.data;
}

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function claimFreeNft(selectedNftIndex: number, address: string, signature: string) {
	const res = await axios.post(`${api}/v1/nfts/claim/`, {
		choice: selectedNftIndex,
		address,
		signature
	});
	console.log(res);

	return res.data.data;
}
