<script>
	import { goto } from '$app/navigation';
	import Copy from '$icons/copy.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import SocialButton from '$lib/components/SocialButton.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { fetchCreatedNfts } from '$utils/api/fetchCreatedNfts';

	const tabs = ['CREATED NFTS', 'COLLECTED NFTS', 'ACTIVITY', 'FAVORITES', 'HIDDEN'];
	let selectedTab = 'CREATED NFTS';
</script>

<div class="h-72 bg-[#D8D8D8]" />

<div class="container mx-auto px-32 relative">
	<img
		src="https://picsum.photos/id/237/200/200"
		class="rounded-full border-white border-4 w-32 absolute top-0 transform -translate-y-1/2"
		alt="Profile avatar."
	/>

	<div class="flex items-center pt-20">
		<span class="font-semibold text-xl mr-2"> Till Lindemann </span>
		<VerifiedBadge />
	</div>

	<div class="flex mt-8">
		<!-- Buttons -->
		<div class="flex flex-col gap-3 h-[min-content] w-72 pt-10">
			<Button variant="rounded-shadow" rounded --py="0.5rem" --px="1.5rem" --width="10rem">
				<div class="flex items-center">
					<div class="flex-grow font-normal">03x...9144</div>
					<Copy />
				</div>
			</Button>

			<Button
				variant="rounded-shadow"
				rounded
				--py="0.5rem"
				--px="1.5rem"
				--width="10rem"
				on:click={() => goto('/profile/edit')}
			>
				Edit Profile
			</Button>
		</div>

		<!-- Bio -->
		<div class="px-16 max-w-[600px]">
			<div class="font-bold text-[#757575]">BIO</div>
			<p class="mt-4 font-semibold use-x-separators h-32">
				ProsperDAO is an experiment + collective of creatives, programmers, healers, investors,
				operators, and advocates, dreaming prosperity into existence.
			</p>
		</div>

		<!-- Social links -->
		<div class="px-16">
			<div class="font-bold text-[#757575]">SOCIAL LINKS</div>

			<div class="flex space-x-2 mt-4">
				<SocialButton social="twitter" href="#" />
				<SocialButton social="facebook" href="#" />
				<SocialButton social="instagram" href="#" />
			</div>
		</div>
	</div>
</div>

<div class="container mx-auto px-32 mt-8 flex space-x-8">
	{#each tabs as tab}
		<TabButton on:click={() => (selectedTab = tab)} selected={selectedTab === tab}>{tab}</TabButton>
	{/each}
</div>

<div class="h-px bg-black opacity-30" />

{#if selectedTab === 'CREATED NFTS'}
	<NftList promise={fetchCreatedNfts()} />
{:else if selectedTab === 'COLLECTED NFTS'}
	<NftList promise={fetchCreatedNfts()} />
{:else}
	<div class="h-24" />
{/if}

<!-- <Modal>
	<NftPopup on:close={() => console.log('close popup')} />
</Modal> -->
<style lang="postcss">
	.use-x-separators {
		@apply relative;
	}

	.use-x-separators::before {
		@apply bg-black opacity-30 w-px absolute left-[-4rem] top-0 h-full bottom-0 my-auto;
		content: '';
	}

	.use-x-separators::after {
		@apply bg-black opacity-30 w-px absolute right-[-4rem] top-0 h-full bottom-0 my-auto;
		content: '';
	}
</style>
