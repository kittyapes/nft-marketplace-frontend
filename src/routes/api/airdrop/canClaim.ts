import { findUserInMerkleTree } from '$utils/wallet/distributeAirdrop';

// Check if the user is on the list
export const post = async (req) => {
  // Parse request body  
  const userAddress = JSON.parse(req.body).userAddress;

  // If no user address is present
  if (!userAddress) {
    throw new Error('User Address is Required');
  }

  // Find the address in the merkle tree
  const userObject = findUserInMerkleTree(userAddress);

  if (userObject) {
    return {
      body: userObject
    }
  } else {
    return {
      body: null
    }
  }

}