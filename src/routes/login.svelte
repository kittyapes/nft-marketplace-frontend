<script lang="ts">
	import { browser } from '$app/env';
	import SignMessagePopup from '$lib/components/AdminLoginPopup.svelte';
	import { setPopup } from '$utils/popup';

	$: browser && setPopup(SignMessagePopup);
</script>
