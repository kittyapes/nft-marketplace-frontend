<script lang="ts">
	import { closePopup } from '$utils/popup';

	export let numberOfHinata: number;
	export let duration: number;
	export let onContinue: () => void;
	export let onCancel: () => void;

	function handleContinue() {
		onContinue && onContinue();
	}

	function handleCancel() {
		closePopup();
		onCancel && onCancel();
	}
</script>

<div class="w-[600px] h-[260px] bg-white p-8 rounded-2xl">
	<div class="font-bold text-lg uppercase text-center">
		You are about to <br /> stake
		<span class="text-xl">
			<span class="gradient-text">{numberOfHinata}</span>
			HINATA for
			<span class="gradient-text">{duration}</span>
			.
		</span>
	</div>

	<div class="flex gap-x-4 mt-16">
		<button
			class="rounded-full py-4 w-1/2 mx-auto uppercase block border-2 border-black font-semibold transition-btn"
			on:click={handleCancel}
		>
			Cancel
		</button>

		<button
			class="rounded-full bg-gradient-to-r from-color-purple to-color-blue py-4 w-1/2 mx-auto text-white uppercase block font-semibold transition-btn"
			on:click={handleContinue}
		>
			Continue
		</button>
	</div>
</div>
