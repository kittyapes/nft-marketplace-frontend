import type { OnChainId } from '$interfaces';
import type { ContractError } from '$interfaces/contractError';
import { getContract } from '$utils/misc/getContract';
import type { BigNumber, ContractTransaction } from 'ethers';
import { noTryAsync } from 'no-try';

export async function contractAuctionBid(listingId: OnChainId, amount: BigNumber) {
	const contract = getContract('marketplace');
	const [err, res]: [any, ContractTransaction] = await noTryAsync(() => contract.bid(listingId, amount));

	if (res) {
		await res.wait(1);
	}

	return { err: err as ContractError, res };
}

export async function contractGetAuctionBid(listingId: OnChainId) {
	const contract = getContract('marketplace');
	const [err, res] = await noTryAsync(() => contract.biddings(listingId));

	return { err: err as ContractError, res };
}
