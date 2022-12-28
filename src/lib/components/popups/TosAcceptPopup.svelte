<script lang="ts">
	import type { PopupHandler } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { handleAgreeToTos } from '$utils/tos';
	import Checkbox from '../Checkbox.svelte';
	import Popup from '../Popup.svelte';
	import ButtonSpinner from '../v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let handler: PopupHandler;

	let iAgreeChecked = false;
	let isWorking = false;

	async function handleButtonClick() {
		isWorking = true;

		const { error } = await handleAgreeToTos();

		if (error) {
			isWorking = false;
			return;
		}

		handler.close();

		isWorking = false;
	}
</script>

<Popup>
	<div>
		<div class="relative">
			<img src="/img/graphics/tos-popup-bg.png" alt="" class="rounded-t-2xl -mt-1 w-full" />
			<div class="absolute top-0 h-full w-full grid place-items-center text-white text-5xl">Hinata</div>
		</div>

		<div class="py-8 px-12">
			<div class="font-bold text-2xl">Welcome to Hinata Marketplace</div>
			<div class="mt-4">
				By using Hinata Marketplace, you agree to the <a href="/terms-and-conditions" class="underline">Terms of Service</a>
				.
			</div>

			<div class="mt-4 font-semibold select-none">
				<Checkbox label="I agree" bind:checked={iAgreeChecked} />
			</div>

			<div class="mt-6">
				<PrimaryButton disabled={!iAgreeChecked || isWorking} on:click={handleButtonClick}>
					{#if isWorking}
						<ButtonSpinner />
					{/if}

					Let's go
				</PrimaryButton>
			</div>
		</div>
	</div>
</Popup>
