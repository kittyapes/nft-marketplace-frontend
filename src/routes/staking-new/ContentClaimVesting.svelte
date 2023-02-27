<script lang="ts">
	import GhostButton from '$lib/components/v2/GhostButton.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';

	let hinataTokensClaim = 0;
	let hinataTokensEscrowed = 0;
	let nextUnlockIn = '29D : 4H : 17M';
</script>

<div class="grid grid-cols-2">
	<div>
		<h2 class="text-lg">Claim Your Rewards</h2>
		<p class="mt-4">
			Your Wallet Address is eligible for this airdrop. Please claim your tokens below by submitting
			a transaction which will pull them to your wallet.
		</p>
	</div>

	<div class="grid grid-cols-2 place-items-center gap-4">
		<h2 class="text-lg">You Will Receive:</h2>

		<div />

		<div>
			<span class="text-gradient">{hinataTokensClaim}</span>
			Hinata tokens:
		</div>

		<PrimaryButton>Claim</PrimaryButton>

		<div>
			<span class="text-gradient">{hinataTokensEscrowed}</span>
			Hinata tokens:
		</div>

		<PrimaryButton>Escrowed</PrimaryButton>

		<div>Next Unlock in:</div>

		<PrimaryButton>{nextUnlockIn}</PrimaryButton>
	</div>
</div>
