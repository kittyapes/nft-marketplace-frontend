<script lang="ts">
	export let disabled = false;
</script>

<button
	on:click
	{disabled}
	class="bg-gradient-a px-2 py-1 border-gradient text-sm active:opacity-50 disabled:opacity-50"
>
	<slot />
</button>
