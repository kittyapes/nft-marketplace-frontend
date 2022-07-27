<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { currentError } from '$stores/error';

	afterNavigate(() => {
		currentError.set(null);
	});
</script>
