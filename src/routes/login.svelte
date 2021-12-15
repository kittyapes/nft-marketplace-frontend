<script lang="ts">
	import { browser } from '$app/env';
	import { login, requestLogin } from '$lib/api/login';
	import { appSigner, currentUserAddress } from '$stores/wallet';

	$: if (browser && $currentUserAddress) {
		runLogin();
	}

	async function runLogin() {
		const toSign = await requestLogin($currentUserAddress);

		console.log('toSign', toSign);

		const signature = await $appSigner.signMessage(toSign);

		console.log('signed', signature);

		const token = login($currentUserAddress, signature);
	}
</script>
