import { welcomeNftClaimedOnServer, welcomeNftMessage } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { getContract } from '$utils/misc/getContract';
import axios from 'axios';
import { writable } from 'svelte/store';
import { getApiUrl } from '.';

export type FreeNftStatus = 'unclaimable' | 'claimable' | 'claimed';
export const freeNftStatus = writable<FreeNftStatus>('unclaimable');

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function hasClaimedFreeNft(address: string): Promise<{ status: FreeNftStatus }> {
	const res = await axios.get(getApiUrl('latest', `nfts/isClaimed/${address}`), await getAxiosConfig()).catch((err) => err.response);

	let status: FreeNftStatus;
	let rest = {};

	if (res.status === 404) {
		console.info('[Free NFT] not claimed and unclaimable.');
		console.info('[Free NFT] ' + res.data.message);

		status = 'unclaimable';
	}

	if (res.status === 200 && res.data.data.isClaimed === false) {
		console.info('[Free NFT] claimable.');

		welcomeNftMessage.set(res.data.data.message);
		status = 'claimable';
	}

	if (res.status === 200 && res.data.data.isClaimed) {
		console.info('[Free NFT] claimed.');

		rest = res.data.data;
		status = 'claimed';
	}

	freeNftStatus.set(status);

	return { status, ...rest };
}

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value. Return
 * false in case of an error.
 */
export async function claimFreeNft(selectedNftIndex: number, address: string, signature: string = '') {
	if (signature) {
		await axios
			.post(
				getApiUrl('latest', `nfts/claim`),
				{
					choice: selectedNftIndex,
					address,
					signature,
				},
				await getAxiosConfig(),
			)
			.catch((err) => err);
	}

	const res = await hasClaimedFreeNft(address);

	interface ClaimData {
		_id: string;
		address: string;
		nonce: number;
		name: string;
		generation: string;
		categories: string;
		isClaimed: boolean;
		createdAt: string; //'2022-03-30T15:23:12.666Z'
		updatedAt: string; //'2022-03-30T15:23:12.666Z';
		__v: number;
		claimingMessage: string;
		claimingMessageIssuedTime: string; //'2022-03-30T15:18:42.564Z';
		animation_url: string;
		image: string;
		nftAmount: number;
		nftID: string; // number
		signature: string;
		uri: string;
	}

	const resData: ClaimData = res;

	try {
		const hinataContract = getContract('token');
		const tx = await hinataContract.claimNFT(address, resData.nftID, resData.nftAmount, resData.nonce, resData.signature, []);
		const txRes = await tx.wait(5);
		welcomeNftClaimedOnServer.set(true);
		return resData;
	} catch (err) {
		throw err;
	}
}
