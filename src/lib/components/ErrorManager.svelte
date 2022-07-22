<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { currentError } from '$stores/error';

	afterNavigate(() => {
		currentError.set(null);
	});

	beforeNavigate(() => {
		if ($currentError === 404) currentError.set(null);
	});
</script>
