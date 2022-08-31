<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { acceptedImages } from '$constants';
	import Loader from '$icons/loader.svelte';
	import PlaceholderImage from '$icons/placeholder-image.svelte';
	import CollectionDisplayStyleSwitcher from '$lib/components/collection/CollectionDisplayStyleSwitcher.svelte';
	import PaymentTokenCard from '$lib/components/collection/PaymentTokenCard.svelte';
	import Royalties from '$lib/components/create/Royalties.svelte';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import SocialLinkInput from '$lib/components/SocialLinkInput.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { nftDraft } from '$stores/create';
	import { currentUserAddress } from '$stores/wallet';
	import type { Collection, UpdateCollectionOptions } from '$utils/api/collection';
	import { apiCreateCollection, apiGetCollectionBySlug, apiUpdateCollection, apiValidateCollectionNameAndSlug, getInitialCollectionData } from '$utils/api/collection';
	import { contractCreateCollection } from '$utils/contracts/collection';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { debounce } from 'lodash-es';
	import { noTryAsync } from 'no-try';
	import { getContext, tick } from 'svelte';
	import { withPrevious } from 'svelte-previous';
	import { writable } from 'svelte/store';

	const layoutStuff = getContext('layout-stuff');

	// Page params
	const collectionSlug = $page.params.collectionSlug;

	// Edit vs. new
	$: isNewCollection = collectionSlug === 'new';

	const blockchainOptions = [{ label: 'Ethereum', value: 'eth', iconUrl: '/svg/currency/eth.svg' }];

	// Data collected from the form or fetched from the server
	let originalCollectionData = null; // Used to check whether data was changed during editing
	const [collectionData, prevCollectionData] = withPrevious<Collection>(getInitialCollectionData() as Collection);
	const serverCollectionToUpdate = writable<Collection | null>(null);

	// An object with collection property keys and bool as values representing their validity
	const formValidity = writable<Partial<{ [K in keyof Collection]: any }>>({});

	const debouncedNameValidation = debounce(async (name: string) => {
		await validateCollectionName(name);
	}, 500);

	const debouncedSlugValidation = debounce(async (slug: string) => {
		await validateCollectionSlug(slug);
	}, 500);

	collectionData.subscribe((data) => {
		// Cancel first since obviously something changed
		$formValidity.image = !!data.image || !!data.logoImageUrl || 'Missing logo image';
		$formValidity.cover = !!data.cover || !!data.backgroundImageUrl || 'Missing cover image';

		const nameRegex = new RegExp(/^\w[\w+|\s|_-]+$/, 'gm');
		const slugRegex = new RegExp(/^\w[\w+_-]+\w$/, 'gm');

		$formValidity.name = !!data.name
			? (!nameRegex.test(data.name) && 'Collection name can only contain alphanumeric characters, -, or _') ||
			  (data.name.length > 25 && 'Collection name Cannot Contain More Than 25 Characters') ||
			  !!data.name
			: 'Missing collection name';
		$formValidity.slug = !!data.slug
			? (!slugRegex.test(data.slug) && 'Collection url can only contain alphanumeric characters, -, or _') ||
			  (data.slug.length > 25 && 'Collection url Cannot Contain More Than 25 Characters') ||
			  !!data.slug
			: 'Collection URL is invalid';

		// Call search again to check the name
		if (data.name !== $prevCollectionData?.name) {
			debouncedNameValidation.cancel();
			if (data.name && typeof $formValidity.name !== 'string') {
				debouncedNameValidation(data.name);
			}
		}

		// Call search again to check the slug
		if (data.slug !== $prevCollectionData?.slug) {
			debouncedSlugValidation.cancel();
			if (data.slug && typeof $formValidity.slug !== 'string') {
				debouncedSlugValidation(data.slug);
			}
		}

		$formValidity.description = !!data.description || 'Missing collection description';
	});

	// Partially editable URL field
	const urlStart = 'https://hinata.io/collections/';
	const collectionUrlPattern = `^${urlStart}[a-z0-9-]+$`;
	const collectionUrl = writable(urlStart);
	let ignoreUrlChange = false;

	async function validateCollectionName(collectionName: string) {
		if (collectionName.toLowerCase() === 'new') {
			$formValidity.name = 'Collection Name is Not Unique';
			return;
		}
		const res = await apiValidateCollectionNameAndSlug(collectionName, null);
		const editCheck = isNewCollection ? true : $serverCollectionToUpdate.name !== collectionName;
		$formValidity.name = res?.nameIsDuplicate && editCheck ? 'Collection Name Is Not Unique' : $formValidity.name;
	}

	async function validateCollectionSlug(collectionSlugEdited: string) {
		if (collectionSlugEdited.toLowerCase() === 'new') {
			$formValidity.slug = 'Collection Slug is Not Unique';
			return;
		}
		const res = await apiValidateCollectionNameAndSlug(null, collectionSlugEdited);
		const editCheck = isNewCollection ? true : $serverCollectionToUpdate.slug !== collectionSlugEdited;
		$formValidity.slug = res?.slugIsDuplicate && editCheck ? 'Collection Slug Is Not Unique' : $formValidity.slug;
	}

	collectionUrl.subscribe(async () => {
		if (ignoreUrlChange) {
			return;
		}

		ignoreUrlChange = true;

		// Do not allow deleting the starting part
		if (!collectionUrl || !$collectionUrl.startsWith(urlStart)) {
			$collectionUrl = urlStart;
			$formValidity.slug = 'Missing collection URL';

			await tick();
			ignoreUrlChange = false;
			return;
		}

		// Without this, the user would be able to paste in any longer text
		// than the urlStart and the urlStart would not be included
		const withoutStart = $collectionUrl.replace(urlStart, '');
		$collectionData.slug = withoutStart;
		$collectionUrl = urlStart + withoutStart;
		$formValidity.slug = true;

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

	let savingCollection = false;

	async function clickSaveCollection() {
		savingCollection = true;

		// Create/Update collection
		if (isNewCollection) {
			await _createCollection();
		} else {
			await _updateCollection();
		}

		savingCollection = false;
	}

	async function _createCollection() {
		console.log($collectionData);
		const [contractError, contractRes] = await noTryAsync(() =>
			contractCreateCollection({
				name: $collectionData.name,
				paymentTokenTicker: 'WETH',
				royalties: $collectionData.royalties,
				slug: $collectionData.slug,
			}),
		);

		if (contractError) {
			console.error(contractError);
			notifyError(contractError.message);
			savingCollection = false;
			return;
		}

		$collectionData.collectionAddress = contractRes.contractAddress;

		const [apiError, apiRes] = await noTryAsync(() => apiCreateCollection($collectionData));

		if (apiError) {
			console.error(apiError);
			notifyError(apiError.message);
			savingCollection = false;
			return;
		}

		notifySuccess('Collection created!');

		// where to go next based on URL params
		if ($page.url.searchParams.has('to')) {
			$nftDraft.collectionName = $collectionData.name;
			goto('/' + $page.url.searchParams.get('to'));
		} else goto('/collections/' + apiRes.data.data.slug);
	}

	async function _updateCollection() {
		const [error, res] = await noTryAsync(() => apiUpdateCollection(collectionToUpdateOptions($collectionData)));

		if (error) {
			notifyError(error.message);
			savingCollection = false;
			return;
		}

		await fetchRemoteCollectionData();

		notifySuccess('Collection updated!');

		// where to go next based on URL params
		if ($page.url.searchParams.has('to')) {
			$nftDraft.collectionName = $collectionData.name;
			goto('/' + $page.url.searchParams.get('to'));
		} else goto('/collections/' + $collectionData.slug);
	}

	// Remote collection data
	async function fetchRemoteCollectionData() {
		const [err, res] = await noTryAsync(() => apiGetCollectionBySlug(collectionSlug));

		if (res?.creator?.toLowerCase() !== $currentUserAddress?.toLowerCase()) {
			// Wish we had a 401 error page
			layoutStuff['setErrorCode'](403);
			return;
		}

		if (err) {
			notifyError('Failed to fetch collection data!');
			console.error(err);
			return;
		}

		// Convert null royalties to an empty string
		res.royalties?.forEach((i) => (i.fees = i.fees || ''));

		// Copy is needed because slug would get overwritten
		serverCollectionToUpdate.set({ ...res });
		collectionData.set({ ...res });
		collectionUrl.set(urlStart + res.slug);

		originalCollectionData = { ...res };
	}

	// Check whether data was changed
	let dataChanged = false;

	$: {
		if (originalCollectionData === null) {
			dataChanged = false;
		}

		dataChanged = JSON.stringify(originalCollectionData) !== JSON.stringify($collectionData);
	}

	// Utils
	function collectionToUpdateOptions(collectionData: Collection) {
		const d = collectionData;

		return {
			description: d.description,
			discordUrl: d.discordUrl,
			displayTheme: d.displayTheme,
			instagramUrl: d.instagramUrl,
			// senstive === hotfix for a backend typo...
			isExplicitSenstive: d.isExplicitSenstive || false,
			name: d.name,
			slug: d.slug.toLowerCase(),
			telegramUrl: d.telegramUrl,
			twitterUrl: d.twitterUrl,
			websiteUrl: d.otherUrl,
			logoImage: collectionData.image,
			backgroundImage: collectionData.cover,
			id: d.id,
		} as UpdateCollectionOptions;
	}

	$: browser && !isNewCollection && $currentUserAddress && fetchRemoteCollectionData();
</script>

<main class="max-w-screen-xl px-16 mx-auto my-32">
	<!-- Title -->
	<h1 class="text-2xl font-semibold uppercase">
		{#if isNewCollection}
			Create <span class="gradient-text">New Collection</span>
		{:else}
			Edit <span class="gradient-text">Collection</span>
		{/if}
	</h1>

	<!-- Two column part -->
	<div class="grid grid-cols-2 mt-16">
		<!-- Logo image labels -->
		<div>
			<div class="-ml-1 text-sm">
				<span class="text-red-500">*</span>
				Required fields
			</div>

			<div class="mt-2 font-semibold uppercase">
				Logo Image <span class="text-red-500">*</span>
			</div>

			<!-- File types -->
			<div class="mt-8 font-semibold">File types:</div>
			<div class="mt-2 text-sm">PNG, GIF, WEBP</div>
			<div class="mt-2 text-sm">Max 10MB</div>
		</div>

		<!-- Logo image drop area -->
		<div>
			<DragDropImage max_file_size={10_000_000} class="w-48 h-48 rounded-full" text="" on:new-blob={newLogoBlobHandler} acceptedFormats={acceptedImages} currentImgUrl={$collectionData.logoImageUrl}>
				<div slot="placeholder"><PlaceholderImage /></div>
			</DragDropImage>
		</div>

		<!-- Featured image labels -->
		<div class="mt-8">
			<div class="font-semibold uppercase">Featured Image</div>
			<div class="text-sm uppercase">Upload File</div>

			<!-- File types -->
			<div class="mt-8 font-semibold">File types:</div>
			<div class="mt-2 text-sm">PNG, GIF, WEBP</div>
			<div>Max 10 MB</div>
		</div>

		<!-- Featured image drop area -->
		<div class="mt-8">
			<DragDropImage max_file_size={10_000_000} class="h-48" on:new-blob={newCoverBlobHandler} acceptedFormats={acceptedImages} currentImgUrl={$collectionData.backgroundImageUrl} />
		</div>

		<!-- Choose display style labels -->
		<div class="mt-16">
			<div class="font-semibold uppercase">Choose Display Style</div>
			<div class="mt-2 text-sm">Change how your items are shown</div>
		</div>

		<!-- Choose display style switcher -->
		<div class="mt-16">
			<CollectionDisplayStyleSwitcher bind:displayStyle={$collectionData.displayTheme} />
		</div>

		<div class="mt-16 mr-32">
			<!-- Collection name -->
			<div>
				<div class="font-semibold uppercase">Collection Name</div>
				<input type="text" required class="w-full mt-2 input" placeholder="The Kitty Collection" bind:value={$collectionData.name} />
			</div>

			<!-- Collection URL -->
			<div>
				<div class="mt-8 font-semibold uppercase">URL</div>
				<input type="text" class="w-full mt-2 lowercase input" pattern={collectionUrlPattern} placeholder="https://hinata.io/collection/treasure-of-the-sea" bind:value={$collectionUrl} />
			</div>
		</div>

		<!-- Description -->
		<div class="mt-16">
			<div class="mb-2 font-semibold uppercase">Description</div>
			<TextArea outline placeholder="A collection of all the kitties in the world." minChars={1} maxChars={200} bind:value={$collectionData.description} />
		</div>
	</div>

	<!-- Royalties -->
	<div class="mb-16">
		<Royalties bind:values={$collectionData.royalties} bind:isValid={$formValidity.royalties} disabled={!isNewCollection} />
	</div>

	<!-- Links -->
	<div class="flex flex-col space-y-2">
		<div class="font-semibold uppercase">Links</div>
		<SocialLinkInput placeholder="Instagram link" bind:value={$collectionData.instagramUrl} iconUrl="/svg/socials/instagram.svg" bind:valid={$formValidity.instagramUrl} />
		<SocialLinkInput placeholder="Discord link" bind:value={$collectionData.discordUrl} iconUrl="/svg/socials/discord.svg" bind:valid={$formValidity.discordUrl} />
		<SocialLinkInput placeholder="Twitter link" bind:value={$collectionData.twitterUrl} iconUrl="/svg/socials/twitter.svg" bind:valid={$formValidity.twitterUrl} />
		<SocialLinkInput placeholder="Website link" bind:value={$collectionData.otherUrl} iconUrl="/svg/socials/globe.svg" bind:valid={$formValidity.otherUrl} />
		<SocialLinkInput placeholder="Telegram link" bind:value={$collectionData.telegramUrl} iconUrl="/svg/socials/telegram.svg" bind:valid={$formValidity.telegramUrl} />
	</div>

	<!-- Blockchain -->
	{#if isNewCollection}
		<div class="flex flex-col mt-16">
			<div class="font-semibold uppercase">Blockchain</div>
			<p class="mt-2 mb-2">Your Collection will be created on the following Blockchain:</p>
			<Dropdown options={blockchainOptions} disabled />
		</div>
	{/if}

	<!-- Payment tokens -->
	{#if isNewCollection}
		<div class="flex flex-col mt-16">
			<div class="font-semibold uppercase">Payment tokens</div>
			<p class="mt-2 mb-2">These tokens can be used to buy and sell your items.</p>
			<PaymentTokenCard symbol="WETH" name="Wrapped Ethereum" iconUrl="/svg/currency/eth.svg" />
		</div>
	{/if}

	<!-- Explicit and sensitive content -->
	<div class="flex items-center mt-16">
		<div class="flex flex-col flex-grow">
			<div class="font-semibold uppercase">Explicit & Sensitive Content</div>
			<p class="mt-2 mb-2">Set this collection as explicit and sensitive content.</p>
		</div>
		<Toggle style={{ button: 'bg-[#747474]', pill: '!w-14 bg-[#EBEBEB]' }} onInsideLabel="" offInsideLabel="" bind:state={$collectionData.isExplicitSenstive} />
	</div>

	<FormErrorList validity={$formValidity} />

	<button class="w-full h-16 mt-8 uppercase btn btn-gradient rounded-3xl" disabled={!formValid || savingCollection || !dataChanged} on:click={clickSaveCollection}>
		{#if isNewCollection}
			Create Collection
		{:else}
			Update collection
		{/if}
	</button>

	{#if savingCollection}
		<Loader class="ml-0" />
	{/if}
</main>
