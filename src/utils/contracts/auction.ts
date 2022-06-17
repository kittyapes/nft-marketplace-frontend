import type { OnChainId } from '$interfaces';
import type { ContractError } from '$interfaces/contractError';
import { getSigner } from '$utils/misc/getters';
import type { BigNumber, ContractTransaction } from 'ethers';
import { noTryAsync } from 'no-try';
import HinataMarketplaceContract from './hinataMarketplace';

export async function contractAuctionBid(listingId: OnChainId, amount: BigNumber) {
	const contract = HinataMarketplaceContract(getSigner());
	const [err, res]: [any, ContractTransaction] = await noTryAsync(() => contract.bid(listingId, amount));

	if (res) {
		await res.wait(1);
	}

	return { err: err as ContractError, res };
}

export async function contractGetAuctionBid(listingId: OnChainId) {
	const contract = HinataMarketplaceContract(getSigner());
	const [err, res] = await noTryAsync(() => contract.biddings(listingId));

	return { err: err as ContractError, res };
}

export async function contractCompleteAuction(listingId: OnChainId) {
	const contract = HinataMarketplaceContract(getSigner());
	const [err, res]: [any, ContractTransaction] = await noTryAsync(() => contract.completeAuction(listingId));

	if (res) {
		await res.wait(1);
	}

	return { err: err as ContractError, res };
}
