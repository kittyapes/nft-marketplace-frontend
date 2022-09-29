import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { get, writable } from 'svelte/store';
import { getApiUrl } from '.';

export type FreeNftStatus = 'unclaimable' | 'claimable' | 'claimed';
export const freeNftStatus = writable<FreeNftStatus>('unclaimable');

const freeNftServerMessageToSign = writable(null);

interface IsClaimedResponse {
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

/**
 * Checks if the user has already signed the message provided by the server in order to claim
 * their free NFT.
 * @returns `true` if user has already submitted a signed message and `false` if they have not.
 */
export function signatureSubmitted() {
	return get(freeNftServerMessageToSign) === null;
}

/**
 * @returns A string containing the message provided by the server which needs to be signed
 * and submitted to the server in order for the user to claim their free NFT.
 */
export async function getFreeNftMessageToSign() {
	// This function is async and is a function for the case we ever need to get the message again, for example if the
	// message expires or is changed on the server
	return get(freeNftServerMessageToSign);
}

/**
 * Check if the user has already claimed and get message to sign and attach to the claim route
 * @param address Currently logged in user's wallet address.
 * @returns An object with the message to sign when claiming and the isClaimed boolean value
 */
export async function hasClaimedFreeNft(address: string) {
	const res = await axios.get(getApiUrl('latest', `nfts/isClaimed/${address}`), await getAxiosConfig()).catch((err) => err.response);

	let status: FreeNftStatus;
	let rest: IsClaimedResponse = {} as any;

	if (res.status === 404) {
		// Profile has not been completed and free NFT cannot be claimed
		console.info('[Free NFT] not claimed and unclaimable.');
		console.info('[Free NFT] ' + res.data.message);

		status = 'unclaimable';
	} else if (res.status === 200 && res.data.data.isClaimedSignature === false) {
		// Profile has been completed, but a signature of the message provided by the server
		// has not been submitted yet, the client needs to send the signed mesage to the server
		console.info('[Free NFT] claimable. Signature not submitted.');

		freeNftServerMessageToSign.set(res.data.data.message);

		rest = res.data.data;
		status = 'claimable';
	} else if (res.status === 200 && res.data.data.signature) {
		// Profile has been completed and a sugnature signed by the user has been
		// submitted to the server. The server has provided a signature back, that can be
		// used to claim the free NFT on chain.
		console.info('[Free NFT] claimable. Signature submitted.');

		rest = res.data.data;
		status = 'claimable';
	} else if (res.status === 200 && res.data.data.onChainTx) {
		console.info('[Free NFT] claimed.');

		rest = res.data.data;
		status = 'claimed';
	}

	freeNftStatus.set(status);

	return { status, ...rest };
}

/**
 *
 * @param selectedNftIndex The index of the selected free NFT. `0` is the portrait version, `1` is the landscape version.
 * @param address The wallet address that is trying to claim a free NFT.
 * @returns
 */
export async function claimFreeNft(selectedNftIndex: number, address: string) {
	let signature = null;

	if (!signatureSubmitted()) {
		// Request user to sign the message provided by the server
		try {
			signature = await get(appSigner).signMessage(await getFreeNftMessageToSign());
		} catch (err) {
			console.error('Error during user signing free NFT server provided message.');
			console.error(err);

			notifyError('Free NFT message signature failed.');

			return false;
		}

		// Submit user signature to the server
		try {
			await axios.post(
				getApiUrl('latest', `nfts/claim`),
				{
					choice: selectedNftIndex,
					address,
					signature,
				},
				await getAxiosConfig(),
			);
		} catch (err) {
			console.error('Failed to submit free NFT user signature to the server.');
			console.error(err);

			notifyError('Communication with server failed.');

			return false;
		}
	}

	// Get data to use during the contract call from the server
	let res: Awaited<ReturnType<typeof hasClaimedFreeNft>>;

	try {
		res = await hasClaimedFreeNft(address);
	} catch (err) {
		console.error('Failed to get free NFT data to use during contract call from the server.');
		console.error(err);

		notifyError('Communication with server failed.');

		return false;
	}

	console.log(res);

	try {
		const hinataContract = getContract('token');

		const params = [address, res.nftID, res.nftAmount, res.nonce, res.signature, []];

		console.debug('Will call claimNFT with the following data:');
		console.debug(...params);

		const tx = await hinataContract.claimNFT(...params);

		// This is a hotfix to allow the crawler on the backend to catch up
		await tx.wait(5);
	} catch (err) {
		console.error('Claming free NFT on the contract failed.');
		console.error(err);

		notifyError('Failed to call contract.');

		return false;
	}

	return true;
}
