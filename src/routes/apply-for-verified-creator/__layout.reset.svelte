<script lang='ts'>
    import Nav from "$lib/components/Nav.svelte";
    import PopupManager from "$utils/popup/PopupManager.svelte";
    import Toast from '$lib/components/toast/index.svelte';

</script>

<svelte:head> 
	<title>Hinata</title>
</svelte:head>


<Nav />
<div class="py-24 mx-auto">
	<slot />
</div>
<Toast />
<PopupManager />
