import { api } from '$constants/api';
import { appSigner, welcomeNftClaimed } from '$stores/wallet';
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

	welcomeNftClaimed.set(res.data.data.isClaimed);

	return res.data.data;
}

// /**
//  * Returns the free NFT details (used to render the UI and add the drop IDs)
//  * @returns An object with the message to sign when claiming and the isClaimed boolean value
//  */
// export const getFreeNFTDetails = async () => {
// 	/**
// 	 *  nftAirdropId: [987654, 987653],
//             nftAirdropUri: ["https://gateway.pinata.cloud/ipfs/QmaDH6qmcJHqKm8xaKDpeuVA7e889oCVpbdVfixd4jLRs2", "https://gateway.pinata.cloud/ipfs/QmT3rd5J3NrbNEktX9nUaZX6GhueW4SvYCf3LFjfmWLA6G"]
// 	 * */
// };

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function claimFreeNft(selectedNftIndex: number, address: string, signature: string) {
	const res = await axios.post(
		`${api}/v1/nfts/claim`,
		{
			choice: selectedNftIndex,
			address,
			signature
		},
		getAxiosConfig()
	);

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

	const resData: ClaimData = res.data.data;

	const hinataContract = getHinataTokenContract(get(appSigner));
	const tx = await hinataContract.claimNFT(
		address,
		resData.nftID,
		resData.nftAmount,
		resData.nonce,
		resData.signature,
		[]
	);
	const txRes = await tx.wait(1);
	console.log(txRes);

	return resData;
}
