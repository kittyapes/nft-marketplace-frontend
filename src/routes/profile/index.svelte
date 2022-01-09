<script>
	import { goto } from '$app/navigation';
	import { currentUserAddress } from '$stores/wallet';

	$: $currentUserAddress && goto('/profile/' + $currentUserAddress);
</script>
