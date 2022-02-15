<script lang="ts">
	import daysFromNow from '$utils/daysFromNow';

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

<div class="w-[500px] h-[375px] bg-white p-8 rounded-2xl flex flex-col justify-evenly items-center">
	<div class="text-md mt-8 font-medium text-center">
		You are about to stake <span class="gradient-text">{numberOfHinata}</span> $HiNATA for
		<span class="gradient-text">{daysFromNow(duration).days}</span>
		days. You will not be able to access these funds until the lockup period ends.
	</div>
	<div class="text-md mt-8 font-medium text-center">Are you sure you want to proceed?</div>

	<div class="flex gap-x-4 w-full border-t-2 pt-5">
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

<style>
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
