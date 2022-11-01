<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import StakeSection from './StakeSection.svelte';
	import Stats from './Stats.svelte';
	let apr: number;
	let dailyHinata: number;
	let dailyWaifu: number;
</script>

<LoadedContent>
	<div class="pr-[8vw] pl-[9vw]">
		<Stats bind:apr bind:dailyHinata bind:dailyWaifu />
		<StakeSection />
	</div>
</LoadedContent>
