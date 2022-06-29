<script lang="ts">
	export let label: string;
	export let selected: boolean;
</script>

<button class="py-3 font-bold border-2 border-black border-opacity-50 rounded-lg w-28 bg-opacity-20" class:border-color-blue={selected} class:bg-color-blue={selected} on:click>
	{label}
</button>
