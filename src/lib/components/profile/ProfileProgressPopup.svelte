<script lang="ts">
	import { goto } from '$app/navigation';
	import { profileCompletionProgress } from '$stores/user';
	import type { PopupHandler } from '$utils/popup';
	import Progressbar from '../Progressbar.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let handler: PopupHandler;

	function handleCompleteProfile() {
		goto('/profile/edit');
		handler.close();
	}

	$: progress = $profileCompletionProgress === null ? 'N/A' : $profileCompletionProgress;
</script>

<div class="gradient-border !border-2">
	<div class="w-[700px] h-[420px] bg-dark-gradient flex flex-col justify-end items-center text-white gap-16">
		<div class="text-center uppercase text-2xl -mt-4">
			Finish setting up your profile and receive <br />
			an nft on us
		</div>

		<div class="w-4/5 mx-auto mt-2 flex flex-col gap-2">
			<Progressbar value={$profileCompletionProgress} />
			<div class="flex justify-between text-sm">
				<div class="text-center">
					Profile completion progress:
					<span class="text-gradient">{progress}%</span>
				</div>
				<div class="text-gradient text-right max-w-max font-black">Free NFT</div>
			</div>
			<div class="flex flex-col gap-5 items-center mt-6 mb-12">
				<PrimaryButton on:click={handleCompleteProfile} class="w-60">Complete your profile</PrimaryButton>

				<PrimaryButton on:click={handler.close} class="w-60">Cancel</PrimaryButton>
			</div>
		</div>
	</div>
</div>
