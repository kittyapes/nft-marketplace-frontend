<script lang="ts">
	// import GhostButton from '$lib/components/v2/GhostButton.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import {
		claimableVestingRewards,
		currentUserAddress,
		escrowedVestingRewards,
	} from '$stores/wallet';
	import {
		claimVestedRewards,
		getRemainingVestingsByAccount,
		getVestingsByAccount,
	} from '$utils/contracts/staking';
	import { ethers } from 'ethers';
	const { formatEther, parseEther } = ethers.utils;
	import { onDestroy, onMount } from 'svelte';
	import dayjs, { Dayjs } from 'dayjs';

	let nextUnlockIn: Dayjs | null = null;
	$: unlockText = '00:00:00';
	let timerInterval;

	async function loadVestingClaimDetails() {
		const vestingDetails = await getVestingsByAccount($currentUserAddress);

		let amountReadyForClaiming = parseEther('0');

		const unlockDurations: number[] = [];

		vestingDetails.map((a) => {
			if (!a.claimed && Date.now() > a.unlockTime * 1000) {
				amountReadyForClaiming = amountReadyForClaiming.add(ethers.utils.parseEther(a.amount));
			} else if (!a.claimed && Date.now() < a.unlockTime * 1000) {
				unlockDurations.push(a.unlockTime);
			}

			return a;
		});

		const unclaimedTotal = await getRemainingVestingsByAccount($currentUserAddress);
		escrowedVestingRewards.set(formatEther(parseEther(unclaimedTotal).sub(amountReadyForClaiming)));
		claimableVestingRewards.set(formatEther(amountReadyForClaiming));

		nextUnlockIn = dayjs(Math.min(...unlockDurations) * 1000);
		// nextUnlockIn = dayjs(Date.now() + 1000 * 3600 * 24 * 7); // For Testing Timer

		updateTimer();
		timerInterval = setInterval(updateTimer, 60000);
	}

	function updateTimer() {
		const currentTime = dayjs();
		const diffTime = (nextUnlockIn ?? dayjs()).unix() - currentTime.unix();

		let duration = dayjs.duration(diffTime * 1000, 'milliseconds');
		const interval = 60000;
		const twoDP = (n: number) => (n > 9 ? n : '0' + n);

		duration = dayjs.duration(duration.asMilliseconds() - interval, 'milliseconds');
		unlockText = `${duration.days() || '00' + 'D '}${duration.hours() || '00'}H ${twoDP(
			duration.minutes() || 0,
		)}M`; //  ${twoDP(duration.seconds())}S - Seconds
	}

	onMount(async () => {
		await loadVestingClaimDetails();
	});

	currentUserAddress.subscribe(async (_address) => {
		await loadVestingClaimDetails();
	});

	onDestroy(() => clearInterval(timerInterval));
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
			<span class="text-gradient">{$claimableVestingRewards}</span>
			Hinata tokens:
		</div>

		<PrimaryButton disabled={+$claimableVestingRewards <= 0} on:click={claimVestedRewards}>
			Claim
		</PrimaryButton>

		<div>
			<span class="text-gradient">{$escrowedVestingRewards}</span>
			Hinata tokens:
		</div>

		<PrimaryButton>Escrowed</PrimaryButton>

		<div>Next Unlock in:</div>

		<PrimaryButton>{unlockText}</PrimaryButton>
	</div>
</div>
