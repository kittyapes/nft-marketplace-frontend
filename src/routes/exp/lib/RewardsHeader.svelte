<script>
	import { goto } from '$app/navigation';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import HorizontalSeparator from './HorizontalSeparator.svelte';
</script>

<div class="grid place-items-center mt-16">
	<h1 class="text-gradient text-5xl font-semibold text-center">Hinata Reward Season 1</h1>
</div>

<h2 class="mt-12 text-3xl uppercase text-center text-glow">
	Take Action - Earn EXP Points - Get Rewards
</h2>

<div class="mt-16 max-w-screen-sm mx-auto">
	<PrimaryButton on:click={() => goto('/marketplace/collections')}>View Collections</PrimaryButton>
</div>

<div class="mt-16">
	<HorizontalSeparator />
</div>

<div class="mt-8">
	<p class="text-center text font-bold text-lg">
		Actions you take will reward you with EXP points. Those EXP points will be extremely important
		at a later date.
	</p>
</div>
