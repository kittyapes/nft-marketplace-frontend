<script lang="ts">
	import IconDropdown from '../IconDropdown.svelte';

	export let options;
	export let icon;
</script>

<div class="w-44">
	<IconDropdown {options}>
		<svelte:component this={icon} slot="icon" />
	</IconDropdown>
</div>
