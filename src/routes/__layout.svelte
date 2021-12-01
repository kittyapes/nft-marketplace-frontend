<script>
	import '$styles/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>

<Nav />
<div class="pt-16">
	<slot />
</div>
<Footer />
