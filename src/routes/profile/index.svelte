<script>
	import { browser } from '$app/env';

	import { goto } from '$app/navigation';
	import { currentUserAddress } from '$stores/wallet';

	const userAddressError = () => {
		browser && goto('/');
	};

	$: $currentUserAddress ? goto('/profile/' + $currentUserAddress) : userAddressError();
</script>
