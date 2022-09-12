<script context="module" lang="ts">
	let _status: number;

	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		_status = status;

		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script lang="ts">
	import ErrorPage from '$lib/components/ErrorPage.svelte';
</script>

<ErrorPage errorCode={_status} />
