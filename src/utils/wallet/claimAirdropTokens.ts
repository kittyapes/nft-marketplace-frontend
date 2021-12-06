import { appSigner } from "$stores/wallet"
import { get } from "svelte/store"
import { claimToken } from "./distributeAirdrop";
import { success, failure } from '$utils/toast'

const claimAirdropTokens = async () => {
  const signer = get(appSigner);

  const userAddress = await signer.getAddress();

  const result = await claimToken(userAddress);

  if (result.status === 'success') {
    success(result.message)
  } else {
    failure(result.message);
  }

}

export default claimAirdropTokens