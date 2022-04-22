import { api } from '$constants/api';
import { appProvider, appSigner, welcomeNftClaimedOnChain, welcomeNftClaimedOnServer, welcomeNftMessage } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { getHinataTokenContract } from '$utils/contracts/generalContractCalls';
import axios from 'axios';
import { get } from 'svelte/store';

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function hasClaimedFreeNft(address: string) {
	const res = await axios.get(`${api}/v1/nfts/isClaimed/${address}`, getAxiosConfig());

	// Check if user's nonce has already claimed
	//console.log(res.data.data);
	if (res.data.data.nonce) {
		const hinataTokenContract = getHinataTokenContract(get(appProvider));
		const hasClaimed = await hinataTokenContract.usedNonce(res.data.data.nonce);

		if (typeof hasClaimed === 'boolean') {
			welcomeNftClaimedOnServer.set(hasClaimed);
			welcomeNftClaimedOnChain.set(hasClaimed);
		}
	} else {
		welcomeNftClaimedOnServer.set(res.data.data.isClaimed);
		if (res.data.data.message) {
			welcomeNftMessage.set(res.data.data?.message);
			welcomeNftClaimedOnChain.set(false);
		}
	}

	return res.data.data;
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
				`${api}/v1/nfts/claim`,
				{
					choice: selectedNftIndex,
					address,
					signature
				},
				getAxiosConfig()
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
		const hinataContract = getHinataTokenContract(get(appSigner));
		const tx = await hinataContract.claimNFT(address, resData.nftID, resData.nftAmount, resData.nonce, resData.signature, []);
		const txRes = await tx.wait(1);
		console.log(txRes);
		welcomeNftClaimedOnServer.set(true);
		welcomeNftClaimedOnChain.set(true);
		return resData;
	} catch (err) {
		throw err;
	}
}
