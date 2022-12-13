<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { removeAuthData } from '$utils/auth/token';
	import { notifySuccess } from '$utils/toast';

	let signedOut = false;

	function signOutClick() {
		removeAuthData($currentUserAddress);
		notifySuccess('You have been signed out.');

		signedOut = true;
	}
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row">
	<AdminSidebar />

	<!-- Page Content -->
	<div class="px-20 py-16">
		<div class="text-4xl uppercase font-bold">Admin Home</div>

		<button class="btn btn-gradient btn-rounded uppercase mt-4" disabled={!$currentUserAddress || signedOut} on:click={signOutClick}>Sign Out</button>
	</div>
</div>
