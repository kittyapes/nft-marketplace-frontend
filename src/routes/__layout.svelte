<script>
	import '$styles/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { layoutOptions } from '$lib/utils/layout';
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>

<div class="type-{$layoutOptions.slotType}">
	<Nav />
	<slot />
	<Footer />
</div>

<style>
	.type-flex {
		@apply flex flex-col h-screen;
	}
</style>
