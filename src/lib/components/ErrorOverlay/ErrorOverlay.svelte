<script>
	import { currentUserAddress } from '$stores/wallet';
	import { removeAuthData } from '$utils/auth/token';
	import { disconnectWallet } from '$utils/wallet/connectWallet';
	import Modal from '../Modal.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	function handleLogout() {
		removeAuthData($currentUserAddress);
		disconnectWallet();

		window.location.reload();
	}
</script>

<Modal>
	<div class="bg-gray-900 text-white w-full h-full">
		<div class="mx-40 my-40  max-w-prose">
			<div class="font-bold text-4xl">Ooops, something went wrong...</div>
			<div class="ml-1 text-lg font-medium mt-4">
				An unexpected error has occured. Please try reloading the site or logging out. If this error doesn't go away, you can view the developer console for more details.
			</div>

			<div class="mt-8">
				<PrimaryButton on:click={handleLogout}>Log Out</PrimaryButton>
			</div>
		</div>
	</div>
</Modal>
