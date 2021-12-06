import merkleTree from '$contracts/merkleDistributor/merkleTree.json'

const findUserInMerkleTree = (userAddress: string) => {
  const userAddressesList = Object.keys(merkleTree.claims);
  const addressInList = userAddressesList.find(el => el.toLowerCase() === userAddress.toLowerCase());

  if (addressInList) {
    return merkleTree.claims[addressInList]
  } else {
    return null;
  }
}

// Check if the user is on the list
export const post = async (req) => {
  // Parse request body  
  const userAddress = JSON.parse(req.body).userAddress;

  // If no user address is present
  if (!userAddress) {
    throw new Error('User Address is Required');
  }

  // Find the address in the merkle tree
  const userObject = findUserInMerkleTree(userAddress)


  if (userObject) {
    return {
      body: {
        merkleRoot: merkleTree.merkleRoot,
        user: userObject
      }
    }
  } else {
    return {
      body: null
    }
  }

}