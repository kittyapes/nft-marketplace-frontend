<script lang="ts">
	import type { PopupHandler } from '$utils/popup';
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
	<div class="text-white max-w-xl">
		<div class="relative">
			<img src="/img/graphics/tos-popup-bg.png" alt="" class="w-full" />
		</div>

		<div class="py-8 px-12">
			<div class="font-bold text-2xl">Welcome to Hinata Marketplace</div>
			<div class="mt-4">
				Please agree to our <a href="/terms-and-conditions" class="underline">Terms of Service</a>
				in order to further use our site.
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
