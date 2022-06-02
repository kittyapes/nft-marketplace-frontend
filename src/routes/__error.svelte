<script context="module" lang="ts">
	import { currentError } from '$stores/error';

	let response: number;

	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		response = status;
		currentError.set(response);
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

<ErrorPage />
