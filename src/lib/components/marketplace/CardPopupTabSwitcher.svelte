<script>
	import History from '$icons/history.svelte';
	import Info from '$icons/info.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import Trade from '$icons/trade.svelte';
	import { notifyError, notifySuccess } from '$utils/toast';

	export let selectedTab = 0;

	let dotsOpen = false;

	const menuOptions = [
		{ label: 'Transfer', action: () => notifyError('Something went wrong.') },
		{ label: 'Hide', action: () => notifyError('Something went wrong.') },
		{
			label: 'Copy link',
			action: () => {
				navigator.clipboard.writeText(window.location.href);
				notifySuccess('Copied!');
			}
		},
		{ label: 'Report content', action: () => notifyError('Something went wrong.') }
	];
</script>

<div class="flex gap-5 w-full">
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 0)}
		class:opacity-50={selectedTab == 0}
	>
		<Info /> INFO
	</div>
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 1)}
		class:opacity-50={selectedTab == 1}
	>
		<Trade /> TRADE
	</div>
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 2)}
		class:opacity-50={selectedTab == 2}
	>
		<History /> HISTORY
	</div>

	<div class="flex-grow" />

	<div class="relative">
		<button class="transition-btn mr-4" on:pointerdown={() => (dotsOpen = !dotsOpen)}>
			<ThreeDots />
		</button>

		{#if dotsOpen}
			<div
				class="flex-col absolute bg-white font-bold rounded-md top-10 -translate-x-24 grid overflow-hidden z-10
				select-none"
				style="box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);"
			>
				{#each menuOptions as option}
					<button
						class="transition-btn whitespace-nowrap text-left font-semibold py-2 first:pt-3 last:pb-3 pl-3 pr-4
						hover:bg-gray-100 active:rounded-md"
						on:click={() => {
							option.action();
							dotsOpen = false;
						}}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
