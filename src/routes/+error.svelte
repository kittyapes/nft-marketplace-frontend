<script context="module" lang="ts">
	throw new Error("@migration task: Replace error load function (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3293209)");

	// let _status: number;

	// /** @type {import('@sveltejs/kit').ErrorLoad} */
	// export function load({ error, status }) {
	// 	_status = status;

	// 	return {
	// 		props: {
	// 			title: `${status}: ${error.message}`
	// 		}
	// 	};
	// }
</script>

<script lang="ts">
	import ErrorPage from '$lib/components/ErrorPage.svelte';
</script>

<ErrorPage errorCode={_status} />
