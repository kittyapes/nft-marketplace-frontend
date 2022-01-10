<script>
	import { goto } from '$app/navigation';
	import { profileCompletionProgress } from '$stores/user';
	import { closePopup } from '$utils/popup';
	import Progressbar from '../Progressbar.svelte';

	function handleCompleteProfile() {
		goto('/profile/edit');
		closePopup();
	}
</script>

<div class="w-[700px] h-[420px] bg-white rounded-3xl flex flex-col justify-center">
	<div class="text-center font-bold uppercase text-lg -mt-4 text-color-black">
		Finish setting up your profile and receive <br /> an nft on us
	</div>

	<div class="text-center font-light text-sm mt-3 text-[#7B7B7B]">You pay the gas fee</div>

	<div class="font-bold text-center mt-6 text-color-black">
		Profile completion progress:
		<span class="gradient-text"> {$profileCompletionProgress || 'N/A'}%</span>
	</div>

	<div class="w-4/5 mx-auto mt-2">
		<Progressbar value={$profileCompletionProgress} />
	</div>

	<div class="gradient-text text-right ml-auto max-w-max mr-[10%] font-black mt-1">Free NFT</div>

	<button
		class="rounded-full bg-gradient-to-r from-color-purple to-color-blue py-4 w-1/2 mx-auto text-white uppercase block mt-6 font-semibold transition-btn"
		on:click={handleCompleteProfile}
	>
		Complete your profile
	</button>

	<button
		class="rounded-full py-4 w-1/2 mx-auto uppercase block mt-3 border-2 border-black font-semibold transition-btn"
		on:click={closePopup}
	>
		Cancel
	</button>
</div>
