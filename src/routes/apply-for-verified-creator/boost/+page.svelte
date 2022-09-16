<script lang="ts">
	import Disconnect from '$icons/disconnect.svelte';
	import CreatorFormScreen from '$lib/components/CreatorFormScreen.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { onMount } from 'svelte';

	let loaded: boolean = false;

	onMount(() => {
		loaded = true;
	});
</script>

<LoadedContent {loaded}>
	<CreatorFormScreen step={3}>
		<div slot="header" class="flex flex-col max-w-3xl gap-5">
			<h1 class="font-bold uppercase text-7xl">
				<p>Boost your</p>
				<p class="gradient-text">wallet</p>
			</h1>
			<button class="self-end text-sm uppercase text-color-black">
				<p class="flex gap-3">
					how does this work?
					<Disconnect />
				</p>
			</button>
		</div>
		<div slot="content" id="form-container" class="flex flex-col max-w-xl gap-8">
			<p class="mb-6 text-sm font-light">
				Earn $100 in tree transactions for your wallet and every Verified Creator who signs up using your link. There is no limit to how many artists you can onboard and no cap to your bonus!
			</p>
			<h1 class="text-lg uppercase text-color-black">Needs twitter/instagram access to continue</h1>
			<div class="flex justify-around">
				<div class="w-2/5 h-40 border-2 border-[#BFB9B9] rounded-lg uppercase grid place-items-center">TWITTER</div>
				<div class="w-2/5 h-40 border-2 border-[#BFB9B9] rounded-lg uppercase grid place-items-center">Instagram</div>
			</div>
			<button class="w-full mt-4 mb-10 text-sm font-normal text-black uppercase btn btn-rounded btn-gradient">share</button>
		</div>
	</CreatorFormScreen>
</LoadedContent>
