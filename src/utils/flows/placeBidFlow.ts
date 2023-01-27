import type { ContractError } from '$interfaces/contractError';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { getApiUrl } from '$utils/api';
import type { Listing } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { getOnChainListing } from '$utils/contracts/listing';
import { ensureAmountApproved, getTokenDetails } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { get } from 'svelte/store';

const PLACE_BID_SOL_TYPES = ['uint256', 'address', 'uint256'];

export async function placeBidFlow(listingId: string, amount: string, txType: Listing['transactionType']): Promise<{ error: Error } | void> {
	const listing = await getOnChainListing(listingId);

	if (!listing?.isValidOnChainListing) {
		notifyError('Failed to Place Bid: Listing is no longer valid');
		return;
	}

	const contract = getContract('marketplace');

	await ensureAmountApproved(contract.address, amount, listing.payToken);

	const token = await getTokenDetails(listing.payToken);

	// Gasless listing
	if (txType === 'GASLESS') {
		const callArgs = [listingId, get(currentUserAddress), ethers.utils.parseUnits(amount, token.decimals)];

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

		// Post signature to API
		axios.post(getApiUrl(null, 'gasless-listings/bid'), {}, await getAxiosConfig());
	}

	// Normal listing
	else {
		const callArgs = [listingId, ethers.utils.parseUnits(amount, token.decimals)];

		try {
			await contractCaller(contract, 'bid', 150, 1, ...callArgs);
		} catch (err) {
			console.log(err);
			notifyError(err.message);
			return;
		}
	}
}
