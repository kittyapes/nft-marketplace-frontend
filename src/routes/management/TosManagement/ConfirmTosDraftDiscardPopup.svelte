<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import type { PopupHandler } from '$utils/popup';
	import type { Writable } from 'svelte/store';

	export let handler: PopupHandler;
	export let label: string;

	export let onDiscardConfirm: () => Promise<boolean>;
	export let discarding: Writable<boolean>;
</script>

<Popup>
	<div class="py-8 px-12 max-w-3xl text-white">
		<div class="text-2xl font-semibold">Confirm Terms of Service document draft discard</div>
		<div class="mt-4">
			You are about to discard a draft of a new Terms of Service document with the label
			<span class="bg-gray-800 py-px px-2 rounded whitespace-nowrap">{label}</span>
			. Do you really want to discard this draft or keep it?
		</div>

		<div class="mt-16 flex gap-2">
			<PrimaryButton variant="red" on:click={onDiscardConfirm} disabled={$discarding}>
				{#if $discarding}
					<ButtonSpinner />
				{/if}
				Discard
			</PrimaryButton>
			<PrimaryButton on:click={handler.close} disabled={$discarding}>Keep</PrimaryButton>
		</div>
	</div>
</Popup>
