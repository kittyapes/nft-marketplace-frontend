import { appSigner, currentUserAddress } from '$stores/wallet';
import { api, getApiUrl, type ApiCallResult } from '$utils/api';
import type { Listing } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { ensureAmountApproved } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { formatToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import type { BigNumber } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { get } from 'svelte/store';

const PLACE_BID_SOL_TYPES = ['uint256', 'address', 'uint256'];

async function placeBidNormal(listing: Listing, amount: BigNumber) {
	const contract = getContract('marketplace');

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	const callArgs = [listing.listingId, amount];

	try {
		await contractCaller(contract, 'bid', 150, 1, ...callArgs);
	} catch (err) {
		console.log(err);
		notifyError(err.message);
		return;
	}
}

async function placeBidGasless(listing: Listing, amount: BigNumber) {
	const contract = getContract('marketplace-v2');

	console.log(listing);

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	const callArgs = [listing.listingId, get(currentUserAddress), amount];

	const message = solidityKeccak256(PLACE_BID_SOL_TYPES, callArgs);

	let signature: string;

	// Get signature from user
	try {
		signature = await get(appSigner).signMessage(message);
	} catch (err) {
		if (err.code === 'ACTION_REJECTED') {
			notifyError('Could not place your bid. Message signature was rejected.');

			return { error: err };
		}
	}

	// Call API with bid data
	const params = {
		listingId: listing.listingId,
		bidPrice: amount.toString(),
		formatBidPrice: formatToken(amount, listing.paymentTokenAddress),
		signature,
	};

	// Build form data
	const formData = new FormData();

	for (const key in params) {
		formData.append(key, params[key]);
	}

	const res: ApiCallResult<{}> = await api.post(getApiUrl(null, 'gasless-listings/bid'), formData, await getAxiosConfig());

	if (res.err) {
		notifyError('Sorry, failed to place your bid.');
	}
}

export async function placeBidFlow(listing: Listing, amount: BigNumber): Promise<{ error: Error } | void> {
	if (listing.chainStatus === 'GASLESS') {
		placeBidGasless(listing, amount);
	} else {
		placeBidNormal(listing, amount);
	}
}
