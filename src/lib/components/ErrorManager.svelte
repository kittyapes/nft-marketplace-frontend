<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { currentError } from '$stores/error';

	beforeNavigate(() => {
		currentError.set(null);
	});
</script>
