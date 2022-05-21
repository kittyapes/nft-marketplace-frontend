<script lang="ts">
	import { fade } from 'svelte/transition';

	export let infoText: [string, string][] = [];
	export let buttonText: string = '';
	export let buyButtonDisabled = false;
</script>

<div in:fade={{ duration: 300 }} class={$$props.class}>
	{#if infoText.length > 0}
		<div class="w-full border-t border-color-black border-opacity-30 flex">
			<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
				<div class="text-sm text-color-black opacity-70 min-w-max">{infoText[0][0]}</div>
				<div class="text-2xl font-semibold text-color-black">{infoText[0][1]}</div>
			</div>

			<div class="w-1/2 pt-2 pl-4">
				<div class="text-sm text-color-black opacity-70 min-w-max">{infoText[1][0]}</div>
				<div class="text-2xl font-semibold text-color-black">
					{infoText[1][1]}
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full mt-3 flex flex-row gap-4" on:click>
		<slot name="bt">
			<button class="btn btn-gradient btn-rounded w-full mb-2" disabled={buyButtonDisabled}>{buttonText}</button>
		</slot>
	</div>
</div>
