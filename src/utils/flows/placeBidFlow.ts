import { profileData, refreshProfileData } from '$stores/user';
import { appSigner } from '$stores/wallet';
import { handleAxiosNetworkError, HandledError, handleErrActionRejected } from '$utils';
import { getApiUrl } from '$utils/api';
import type { Listing } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { ensureAmountApproved } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { formatToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { ethers, type BigNumber, type BigNumberish } from 'ethers';
import { get } from 'svelte/store';

async function placeBidNormal(listing: Listing, amount: BigNumber): Promise<void> {
	const contract = getContract('marketplace');

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	const callArgs = [listing.listingId, amount];

	try {
		await contractCaller(contract, 'bid', 150, 1, ...callArgs);
	} catch (err) {
		console.error(err);
		notifyError(err.message);
	}
}

async function getBidSignature(bidder: ethers.Signer, bidAmount: BigNumberish, nonce: BigNumberish): Promise<string> {
	const message = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [await bidder.getAddress(), bidAmount, nonce]);

	return await bidder.signMessage(ethers.utils.arrayify(message));
}

async function placeBidGasless(listing: Listing, amount: BigNumber): Promise<void> {
	const contract = getContract('marketplace-v2');

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	try {
		await refreshProfileData();
	} catch (err) {
		throw new HandledError('Failed to refresh profile data.', err);
	}

	const bidderData = get(profileData);
	const nonce = bidderData.lastUsedBidNonce + 1;

	// Get signature from user
	let signature: string;

	try {
		signature = await getBidSignature(get(appSigner), amount, nonce);
	} catch (err) {
		handleErrActionRejected(err, 'Request to sign gasless bid message was rejected.');

		throw err;
	}

	// Call API with bid data
	const params = {
		listingId: listing.listingId,
		bidPrice: amount.toString(),
		formatBidPrice: formatToken(amount, listing.paymentTokenAddress),
		nonce,
		signature,
	};

	// Build form data
	const formData = new FormData();

	for (const key in params) {
		formData.append(key, params[key]);
	}

	try {
		await axios.post(getApiUrl(null, 'gasless-listings/bid'), formData, await getAxiosConfig());
	} catch (err) {
		handleAxiosNetworkError(err);

		throw err;
	}
}

export async function placeBidFlow(listing: Listing, amount: BigNumber): Promise<void> {
	if (listing.chainStatus === 'GASLESS') {
		await placeBidGasless(listing, amount);
	} else {
		await placeBidNormal(listing, amount);
	}
}
