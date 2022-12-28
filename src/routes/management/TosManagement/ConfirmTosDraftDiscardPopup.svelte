<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import type { PopupHandler } from '$utils/popup';
	import type { Writable } from 'svelte/store';

	export let handler: PopupHandler;
	export let label: string;

	export let onDiscardConfirm: () => Promise<boolean>;
	export let discarding: Writable<boolean>;
</script>

<Popup>
	<div class="py-8 px-12 max-w-3xl">
		<div class="text-2xl font-semibold">Confirm Terms of Service document draft discard</div>
		<div class="mt-4">
			You are about to discard a draft of a new Terms of Service document with the label
			<span class="bg-gray-100 py-px px-2 rounded">{label}</span>
			. Do you really want to discard this draft or keep it?
		</div>

		<div class="mt-16 flex gap-2">
			<SecondaryButton on:click={onDiscardConfirm} disabled={$discarding}>
				{#if $discarding}
					<ButtonSpinner secondary />
				{/if}
				Discard
			</SecondaryButton>
			<PrimaryButton on:click={handler.close} disabled={$discarding}>Keep</PrimaryButton>
		</div>
	</div>
</Popup>
