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
	import { apiCreateCollection, Collection, getInitialCollectionData } from '$utils/api/collection';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import { tick } from 'svelte';
	import { noTry, noTryAsync } from 'no-try';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { goto } from '$app/navigation';
	import Loader from '$icons/loader.svelte';
	import { acceptedImages } from '$constants';

	const blockchainOptions = [{ label: 'Ethereum', value: 'eth', iconUrl: '/svg/currency/eth.svg' }];

	// Data collected from the form
	const collectionData = writable<Collection>(getInitialCollectionData() as Collection);

	// An object with collection property keys and bool as values representing their validity
	const formValidity = writable<Partial<{ [K in keyof Collection]: any }>>({});

	collectionData.subscribe((data) => {
		$formValidity.image = !!data.image || 'Missing logo image';
		$formValidity.cover = !!data.cover || 'Missing cover image';
		$formValidity.name = !!data.name || 'Missing collection name';
		$formValidity.url = !!data.url?.match(collectionUrlPattern) || 'Collection URL is invalid';
		$formValidity.description = !!data.description || 'Missing collection description';
	});

	// Partially editable URL field
	const urlStart = 'https://hinata.io/collections/';
	const collectionUrlPattern = `^${urlStart}[a-z0-9-]+$`;
	let ignoreUrlChange = false;

	collectionData.subscribe(async (data) => {
		if (ignoreUrlChange) {
			return;
		}

		ignoreUrlChange = true;

		// Do not allow deleting the starting part
		if (!data.url || !data.url.startsWith(urlStart)) {
			$collectionData.url = urlStart;
			$formValidity.url = 'Missing collection URL';

			await tick();
			ignoreUrlChange = false;
			return;
		}

		// Without this, the user would be able to paste in any longer text
		// than the urlStart and the urlStart would not be included
		const withoutStart = data.url.replace(urlStart, '');
		$collectionData.url = urlStart + withoutStart;
		$formValidity.url = true;

		await tick();
		ignoreUrlChange = false;
	});

	$: formValid = Object.values($formValidity).every((v) => v === true);

	function newLogoBlobHandler(event) {
		const { blob } = event.detail;

		collectionData.update((collection) => {
			collection.image = blob;

			return collection;
		});
	}

	function newCoverBlobHandler(event) {
		const { blob } = event.detail;

		collectionData.update((collection) => {
			collection.cover = blob;

			return collection;
		});
	}

	let creatingCollection = false;

	async function clickCreateCollection() {
		creatingCollection = true;

		const [error, res] = await noTryAsync(() => apiCreateCollection($collectionData));

		if (error) {
			notifyError(error.message);
			return;
		}

		notifySuccess('Collection created!');

		goto('/collections/' + res.data.data._id);

		creatingCollection = false;
	}

	// $: console.log($collectionData);
	// $: console.log('formValidity', $formValidity);
</script>

<main class="max-w-screen-xl mx-auto my-32 px-16">
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
			<div class="mt-2 text-sm">PNG, GIF, WEBP</div>
		</div>

		<!-- Logo image drop area -->
		<div>
			<DragDropImage class="w-48 h-48 rounded-full" text="" on:new-blob={newLogoBlobHandler} acceptedFormats={acceptedImages}>
				<div slot="placeholder"><PlaceholderImage /></div>
			</DragDropImage>
		</div>

		<!-- Featured image labels -->
		<div class="mt-8">
			<div class="uppercase font-semibold">Featured Image</div>
			<div class="uppercase text-sm">Upload File</div>

			<!-- File types -->
			<div class="font-semibold mt-8">File types:</div>
			<div class="mt-2 text-sm">PNG, GIF, WEBP, MP4, MP3</div>
			<div>Max 50 mb</div>
		</div>

		<!-- Featured image drop area -->
		<div class="mt-8">
			<DragDropImage class="h-48" on:new-blob={newCoverBlobHandler} acceptedFormats={acceptedImages} />
		</div>

		<!-- Choose display style labels -->
		<div class="mt-16">
			<div class="uppercase font-semibold">Choose Display Style</div>
			<div class="mt-2 text-sm">Change how your items are shown</div>
		</div>

		<!-- Choose display style switcher -->
		<div class="mt-16">
			<CollectionDisplayStyleSwitcher bind:displayStyle={$collectionData.displayTheme} />
		</div>

		<div class="mr-32 mt-16">
			<!-- Collection name -->
			<div>
				<div class="uppercase font-semibold">Collection Name</div>
				<input type="text" required class="input mt-2 w-full" placeholder="The Kitty Collection" bind:value={$collectionData.name} />
			</div>

			<!-- Collection URL -->
			<div>
				<div class="uppercase font-semibold mt-8">URL</div>
				<input type="text" class="input mt-2 w-full" pattern={collectionUrlPattern} placeholder="https://hinata.io/collection/treasure-of-the-sea" bind:value={$collectionData.url} />
			</div>
		</div>

		<!-- Description -->
		<div class="mt-16">
			<div class="uppercase font-semibold mb-2">Description</div>
			<TextArea outline placeholder="A collection of all the kitties in the world." minChars={1} maxChars={200} bind:value={$collectionData.description} />
		</div>
	</div>

	<!-- Royalties -->
	<div>
		<Royalties bind:values={$collectionData.royalties} bind:isValid={$formValidity.royalties} />
	</div>

	<!-- Links -->
	<div class="mt-16 flex flex-col space-y-2">
		<div class="uppercase font-semibold">Links</div>
		<SocialLinkInput placeholder="Instagram link" bind:value={$collectionData.instagramUrl} iconUrl="/svg/socials/instagram.svg" bind:valid={$formValidity.instagramUrl} />
		<SocialLinkInput placeholder="Discord link" bind:value={$collectionData.discordUrl} iconUrl="/svg/socials/discord.svg" bind:valid={$formValidity.discordUrl} />
		<SocialLinkInput placeholder="Twitter link" bind:value={$collectionData.twitterUrl} iconUrl="/svg/socials/twitter.svg" bind:valid={$formValidity.twitterUrl} />
		<SocialLinkInput placeholder="Website link" bind:value={$collectionData.otherUrl} iconUrl="/svg/socials/globe.svg" bind:valid={$formValidity.otherUrl} />
		<SocialLinkInput placeholder="Telegram link" bind:value={$collectionData.telegramUrl} iconUrl="/svg/socials/telegram.svg" bind:valid={$formValidity.telegramUrl} />
	</div>

	<!-- Blockchain -->
	<div class="mt-16 flex flex-col">
		<div class="uppercase font-semibold">Blockchain</div>
		<p class="mt-2 mb-2">Your Collection will be created on the following Blockchain:</p>
		<Dropdown options={blockchainOptions} disabled />
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

	<FormErrorList validity={$formValidity} />

	<button class="btn btn-gradient h-16 w-full rounded-3xl mt-8 uppercase" disabled={!formValid || creatingCollection} on:click={clickCreateCollection}>Create Collection</button>

	{#if creatingCollection}
		<Loader class="ml-0" />
	{/if}
</main>
