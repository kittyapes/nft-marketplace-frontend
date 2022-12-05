<script>
	import Copy from '$icons/copy.svelte';
	import Eth from '$icons/eth.svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import { compactNumberFormat } from '$utils/api';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import { shortenAddress } from '$utils/misc/shortenAddress';
	// TODO add user type
	export let user;
	let isHovered = false;
</script>

<div class="p-4 2xl:p-5 bg-dark-gradient">
	<div
		on:mouseover={() => (isHovered = true)}
		on:focus={() => (isHovered = true)}
		on:mouseout={() => (isHovered = false)}
		on:blur={() => (isHovered = false)}
		class:border-gradient={isHovered}
		class="w-full"
	>
		<div class="background thumbnail min-h-[321px] 2xl:min-h-[400px] bg-cover" style="--url: url({user?.coverUrl ?? ''})" />
		<div class=" w-full p-4 2xl:p-5 bg-gradient flex flex-row justify-between flex-wrap gap-y-4 items-center">
			<div class="flex flex-row items-center gap-x-2 2xl:gap-x-3">
				<div class="background thumbnail min-w-[72px] 2xl:min-w-[90px] min-h-[72px] 2xl:min-h-[90px] bg-cover" style="--url: url({user?.thumbnailUrl ?? ''})" />
				<div class="flex flex-col gap-y-4 2xl:gap-y-6">
					<div class="flex flex-row items-center gap-x-2 2xl:gap-x-2.5">
						<h1 class="font-semibold text-2xl 2xl:text-4xl leading-4 2xl:leading-6 whitespace-nowrap">{user?.username || ''}</h1>
						{#if user?.status === 'VERIFIED'}
							<HinataBadge class="w-6 h-6 2xl:h-8 2xl:w-8" />
						{/if}
					</div>
					<div class="flex flex-row items-center gap-x-2 2xl:gap-x-2.5">
						<h3 class="text-gradient text-base 2xl:text-xl leading-4 2xl:leading-6 whitespace-nowrap">{user?.username || ''}</h3>
						<div class="flex flex-row items-center bg-black bg-opacity-25 px-2.5 py-1.5 gap-x-2.5">
							<Eth gradient class="w-2.5 h-4 2xl:w-3 2xl:h-5" />
							<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">{shortenAddress(user?.address) || ''}</p>
							<button
								on:click={() => {
									copyTextToClipboard(user?.address);
								}}
							>
								<Copy class="w-2.5 h-4 2xl:w-3 2xl:h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-y-5 2xl:gap-y-6 font-semibold text-base xl:text-xl">
				<button class="border-gradient w-28 2xl:w-36  bg-gradient-a hover:bg-main-gradient  leading-6 2xl:leading-7">Follow</button>
				<!-- TODO clarify what created is -->
				<p>Created {compactNumberFormat(3200)}</p>
			</div>
		</div>
	</div>
</div>
