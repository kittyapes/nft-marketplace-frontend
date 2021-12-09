import { ethers } from 'ethers';
import distributorAbi from '$contracts/merkleDistributor/distributorAbi.json';
import merkleTree from '$contracts/merkleDistributor/merkleTree.json'
import { appProvider, appSigner, userClaimsObject } from '$stores/wallet';
import { get } from 'svelte/store';
import { merkleDistributorContractAddress } from '$constants/contractAddresses';


export const claimToken = async (userAddress: string) => {
  // Claims Object
  const claimsObject = get(userClaimsObject);

  if (!claimsObject) {
    return { status: 'error', message: "Error, User Not Allowed to Claim" };
  }

  // Signed Contract
  const distributorContract = new ethers.Contract(merkleDistributorContractAddress, distributorAbi, get(appSigner));


  try {
    let txHash = await distributorContract.claim(claimsObject.user.index, userAddress, claimsObject.user.amount, claimsObject.user.proof)
    console.log(txHash)
    return { status: 'success', message: "Successfully Claimed Tokens" };
  } catch (err) {
    if ((err?.message as string).includes('already claimed')) {
      return { status: 'error', message: 'User Already Claimed' }
    } else {
      return { status: 'error', message: err?.message || JSON.stringify(err) };
    }
  }
}

export const userCanClaim = async (userAddress: string) => {
  const distributorContract = new ethers.Contract(merkleDistributorContractAddress, distributorAbi, get(appProvider));

  // Check if the airdrop tokens have been claimed or not
  try {
    let isClaimed = await distributorContract.isClaimed(userAddress);

    // User cannot claim if they had already claimed
    return !isClaimed;
  } catch (err) {
    console.log(err);
    return true;
  }
}

export const findUserInMerkleTree = (userAddress: string) => {
  const userAddressesList = Object.keys(merkleTree.claims);

  // Address in the merkle tree (with its capitalization)
  const addressInList = userAddressesList.find(el => el.toLowerCase() === userAddress.toLowerCase());
  if (addressInList) {
    return {
      merkleRoot: merkleTree.merkleRoot,
      user: {
        address: addressInList,
        ...merkleTree.claims[addressInList]
      }
    }
  } else {
    return null;
  }
}