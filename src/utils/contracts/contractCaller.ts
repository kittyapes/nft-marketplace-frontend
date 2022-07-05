import type { ethers } from 'ethers';

/**
 *
 * @param contract ethers.Contract Instance e.g MarketplaceContract
 * @param methodName function name you are calling from contract
 * @param gasMultiple multiplier for gas i.e. if you want 1.1 times the gas input 110
 * @param confirmations number of confirmations to wait for before returning result
 * @param params contract call parameters (implemented as ...rest)
 * @returns ethers.ContractReceipt
 */

export default async function (contract: ethers.Contract, methodName: string, gasMultiple: number = 110, confirmations: number = 1, ...params: any) {
	try {
		// Estimate Gas First
		const gasEst = await contract.estimateGas[methodName](...params).catch((err) => {
			// Throw error if any is found
			throw err;
		});

		// Make contract call
		const contractCall = await contract[methodName](...params, {
			gasLimit: gasEst.mul(gasMultiple).div(100)
		});

		await contractCall.wait(confirmations);
		return contractCall;
	} catch (error) {
		throw error;
	}
}
