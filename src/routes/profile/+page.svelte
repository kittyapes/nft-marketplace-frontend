<script>
	import { browser } from '$app/environment';

	import { goto } from '$app/navigation';
	import { currentUserAddress } from '$stores/wallet';

	const noWalletConnectedFix = () => {
		return browser && goto('/');
	};

	$: $currentUserAddress ? goto('/profile/' + $currentUserAddress) : noWalletConnectedFix();
</script>
