<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import type { PopupHandler } from '$utils/popup';
	import type { Writable } from 'svelte/store';

	export let handler: PopupHandler;
	export let label: string;

	export let onPublishConfirm: () => Promise<boolean>;
	export let publishing: Writable<boolean>;
</script>

<Popup>
	<div class="py-8 px-12 max-w-3xl text-white">
		<div class="text-2xl font-semibold">Confirm publishing Terms of Service document</div>
		<div class="mt-4">
			You are about to publish a draft of a new Terms of Service document with the label
			<span class="py-px px-2 rounded bg-gray-800 whitespace-nowrap">{label}</span>
			. Do you really want to publish this draft?
		</div>

		<div class="mt-16 flex gap-2">
			<PrimaryButton variant="green" on:click={onPublishConfirm} disabled={$publishing}>
				{#if $publishing}
					<ButtonSpinner secondary />
				{/if}
				Publish
			</PrimaryButton>
			<PrimaryButton on:click={handler.close} disabled={$publishing}>Cancel</PrimaryButton>
		</div>
	</div>
</Popup>
