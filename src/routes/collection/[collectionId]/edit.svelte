<script lang="ts">
	import PlaceholderImage from '$icons/placeholder-image.svelte';
	import CollectionDisplayStyleSwitcher from '$lib/components/collection/CollectionDisplayStyleSwitcher.svelte';
	import PaymentTokenCard from '$lib/components/collection/PaymentTokenCard.svelte';
	import Royalties from '$lib/components/create/Royalties.svelte';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import SocialLinkInput from '$lib/components/SocialLinkInput.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { writable } from 'svelte/store';
	import type { Collection } from '$utils/api/collection';

	const blockchainOptions = [{ label: 'Ethereum', value: 'eth' }];

	const collectionData = writable<Collection>({} as Collection);
</script>

<main class="max-w-screen-xl mx-auto my-32">
	<!-- Title -->
	<h1 class="text-2xl uppercase font-semibold">
		Create <span class="gradient-text">New Collection</span>
	</h1>

	<!-- Two column part -->
	<div class="mt-16 grid grid-cols-2">
		<!-- Logo image labels -->
		<div>
			<div class="text-sm -ml-1">
				<span class="text-red-500">*</span>
				Required fields
			</div>

			<div class="uppercase font-semibold mt-2">
				Logo Image <span class="text-red-500">*</span>
			</div>

			<!-- File types -->
			<div class="font-semibold mt-8">File types:</div>
			<div class="mt-2">PNG, GIF, WEBP</div>
		</div>

		<!-- Logo image drop area -->
		<div>
			<DragDropImage class="w-48 h-48 rounded-full" text="">
				<div slot="placeholder"><PlaceholderImage /></div>
			</DragDropImage>
		</div>

		<!-- Featured image labels -->
		<div class="mt-8">
			<div class="uppercase font-semibold">Featured Image</div>
			<div class="uppercase">Upload File</div>

			<!-- File types -->
			<div class="font-semibold mt-8">File types:</div>
			<div class="mt-2">PNG, GIF, WEBP, MP4, MP3</div>
			<div>Max 50 mb</div>
		</div>

		<!-- Featured image drop area -->
		<div class="max-w-md mt-8">
			<DragDropImage class="h-48" />
		</div>

		<!-- Choose display style labels -->
		<div class="mt-16">
			<div class="uppercase font-semibold">Choose Display Style</div>
			<div class="mt-2">Change how your items are shown</div>
		</div>

		<!-- Choose display style switcher -->
		<div class="mt-16">
			<CollectionDisplayStyleSwitcher />
		</div>

		<div class="mr-32 mt-16">
			<!-- Collection name -->
			<div>
				<div class="uppercase font-semibold">Collection Name</div>
				<input type="text" class="input mt-2 w-full" placeholder="The Kitty Collection" />
			</div>

			<!-- Collection URL -->
			<div>
				<div class="uppercase font-semibold mt-8">URL</div>
				<input type="text" class="input mt-2 w-full" placeholder="https://hinata.io/collection/treasure-of-the-sea" />
			</div>
		</div>

		<!-- Description -->
		<div class="mt-16">
			<div class="uppercase font-semibold mb-2">Description</div>
			<TextArea outline placeholder="A collection of all the kitties in the world." maxChars={200} />
		</div>
	</div>

	<!-- Royalties -->
	<div>
		<Royalties />
	</div>

	<!-- Links -->
	<div class="mt-16 flex flex-col space-y-2">
		<div class="uppercase font-semibold">Links</div>
		<SocialLinkInput placeholder="Instagram link" bind:value={$collectionData.instagramUrl} iconUrl="/svg/socials/instagram.svg" />
		<SocialLinkInput placeholder="Discord link" bind:value={$collectionData.discordUrl} iconUrl="/svg/socials/discord.svg" />
		<SocialLinkInput placeholder="Twitter link" bind:value={$collectionData.twitterUrl} iconUrl="/svg/socials/twitter.svg" />
		<SocialLinkInput placeholder="Website link" bind:value={$collectionData.otherUrl} iconUrl="/svg/socials/globe.svg" />
		<SocialLinkInput placeholder="Telegram link" bind:value={$collectionData.telegramUrl} iconUrl="/svg/socials/telegram.svg" />
	</div>

	<!-- Blockchain -->
	<div class="mt-16 flex flex-col">
		<div class="uppercase font-semibold">Blockchain</div>
		<p class="mt-2 mb-2">Select the blockchain where you'd like new items from this collection to be added by default.</p>
		<Dropdown options={blockchainOptions} />
	</div>

	<!-- Payment tokens -->
	<div class="mt-16 flex flex-col">
		<div class="uppercase font-semibold">Payment tokens</div>
		<p class="mt-2 mb-2">These tokens can be used to buy and sell your items.</p>
		<PaymentTokenCard symbol="ETH" name="Ethereum" iconUrl="/svg/currency/eth.svg" />
	</div>

	<!-- Explicit and sensitive content -->
	<div class="mt-16 flex items-center">
		<div class="flex flex-col flex-grow">
			<div class="uppercase font-semibold">Explicit & Sensitive Content</div>
			<p class="mt-2 mb-2">Set this collection as explicit and sensitive content.</p>
		</div>
		<Toggle style={{ button: 'bg-[#747474]', pill: '!w-14 bg-[#EBEBEB]' }} onInsideLabel="" offInsideLabel="" />
	</div>

	<button class="btn btn-gradient h-16 w-full rounded-3xl mt-8 uppercase">Create Collection</button>
</main>
