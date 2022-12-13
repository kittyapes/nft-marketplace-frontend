<script lang="ts">
	import Input from './v2/Input/Input.svelte';

	export let placeholder: string = '';
	export let value: string;
	export let iconComponent;
	export let pattern = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?';
	export let valid: boolean = true;

	$: valid = !value || (!!value && !!value.match(pattern));
</script>

<div class="flex flex-row gap-x-2">
	<div class="rounded-none w-8 2xl:w-10 h-8 2xl:h-10">
		<svelte:component this={iconComponent} class="w-full h-full" />
	</div>
	<Input fixedHeight={false} class="border border-white rounded-none h-8 2xl:h-10" {placeholder} {pattern} bind:value />
</div>
