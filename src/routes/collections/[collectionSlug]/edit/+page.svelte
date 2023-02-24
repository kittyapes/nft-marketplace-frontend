<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { acceptedImages } from '$constants';
	import Loader from '$icons/loader.svelte';
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
	import GoBack from '$components/v2/GoBack/+page.svelte';
	import PlaceholderImageV2 from '$icons/placeholder-image-v2.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Artstation from '$icons/socials/artstation.svelte';
	import EthV2 from '$icons/eth-v2.svelte';

	const layoutStuff = getContext('layout-stuff');

	// Page params
	const collectionSlug = $page.params.collectionSlug;

	// Edit vs. new
	$: isNewCollection = collectionSlug === 'new';

	const blockchainOptions = [{ label: 'Ethereum', value: 'eth', iconComponent: EthV2 }];

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
			$nftDraft.collectionAddress = $collectionData.collectionAddress;
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
			$nftDraft.collectionAddress = $collectionData.collectionAddress;
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

<main class="py-24 2xl:py-28 px-28 2xl:px-36 text-white">
	<GoBack />
	<div class="mt-16 2xl:mt-20">
		<h1 class="font-medium text-xl 2xl:text-2xl leading-5 2xl:leading-6">
			{#if isNewCollection}
				Create new collection
			{:else}
				Edit collection
			{/if}
		</h1>
		<div class="space-y-24 2xl:space-y-[120px]">
			<!-- Logo -->
			<div class="section mt-2.5">
				<h3 class="section-title w-1/2">Logo Image *</h3>
				<DragDropImage
					max_file_size={10_000_000}
					class=" w-36 2xl:w-44 h-36 2xl:h-44 border border-dashed flex items-center justify-center"
					text=""
					on:new-blob={newLogoBlobHandler}
					acceptedFormats={acceptedImages}
					currentImgUrl={$collectionData.logoImageUrl}
				>
					<PlaceholderImageV2 slot="placeholder" class="w-10 2xl:w-12 h-auto" />
					<p slot="lower_text" class="section-subtext absolute bottom-3">PNG, GIF, WEBP</p>
				</DragDropImage>
			</div>
			<!-- Featured image -->
			<div class="section">
				<div class="w-1/2">
					<h3 class="section-title">Featured Image</h3>
					<p class="section-subtext mt-2.5">Upload image</p>
				</div>
				<div class="w-1/2">
					<DragDropImage max_file_size={50_000_000} class="h-48" on:new-blob={newCoverBlobHandler} acceptedFormats={acceptedImages} currentImgUrl={$collectionData.backgroundImageUrl}>
						<p slot="placeholder" class="section-subtext font-medium">
							Drag and drop an image <br />
							or
							<span class="text-gradient">click to browse</span>
						</p>
						<p slot="lower_text" class="section-subtext mt-2.5">
							PNG, JPEG, JPG, GIF, WEBP, WEBM, MP4 | <span class="text-gradient">MAX 50MB</span>
						</p>
					</DragDropImage>
				</div>
			</div>
			<!-- Theme selector -->
			<div class="section">
				<div class="w-1/2">
					<h3 class="section-title">Choose display theme</h3>
					<p class="section-subtext mt-2.5">Change how your items are shown</p>
				</div>
				<div class="w-1/2">
					<CollectionDisplayStyleSwitcher bind:displayStyle={$collectionData.displayTheme} />
				</div>
			</div>
			<!-- Name, URL and Descriptions -->
			<div class="section items-stretch">
				<div class="w-1/2 pr-6">
					<h3 class="section-title">Display name</h3>
					<Input fixedHeight={false} bind:value={$collectionData.name} placeholder="The Kitty Collection" class="border border-white rounded-none mt-3 h-8 2xl:h-10 section-subtext" />
					<h3 class="section-title mt-11 2xl:mt-14">URL</h3>
					<Input
						fixedHeight={false}
						pattern={collectionUrlPattern}
						bind:value={$collectionUrl}
						placeholder="https://hinata.io/collection/treasure-of-the-sea"
						class="border border-white rounded-none mt-3 section-subtext h-8 2xl:h-10 "
					/>
				</div>

				<div class="w-1/2 flex flex-col">
					<h3 class="section-title">Description</h3>
					<TextArea
						focusStyle={false}
						containerClass="mt-3 flex-grow section-subtext"
						rows={3}
						placeholder="Tell us about yourself in a few words"
						minChars={1}
						maxChars={200}
						bind:value={$collectionData.description}
					/>
				</div>
			</div>

			<div class="w-1/2">
				<Royalties bind:values={$collectionData.royalties} bind:error={$formValidity.royalties} disabled={!isNewCollection} />
			</div>

			<!-- Social Links -->
			<div class="section">
				<div class="w-1/2 flex flex-col gap-y-4">
					<h3 class="section-title">Links</h3>

					<SocialLinkInput placeholder="Instagram link" bind:value={$collectionData.instagramUrl} iconComponent={Instagram} bind:valid={$formValidity.instagramUrl} />
					<SocialLinkInput placeholder="Discord link" bind:value={$collectionData.discordUrl} iconComponent={Discord} bind:valid={$formValidity.discordUrl} />
					<SocialLinkInput placeholder="Twitter link" bind:value={$collectionData.twitterUrl} iconComponent={Twitter} bind:valid={$formValidity.twitterUrl} />
					<SocialLinkInput placeholder="Website link" bind:value={$collectionData.otherUrl} iconComponent={Web} bind:valid={$formValidity.otherUrl} />
					<SocialLinkInput placeholder="Pixiv link" bind:value={$collectionData.pixivUrl} iconComponent={Pixiv} bind:valid={$formValidity.pixivUrl} />
					<SocialLinkInput placeholder="Deviantart link" bind:value={$collectionData.deviantartUrl} iconComponent={Deviantart} bind:valid={$formValidity.deviantartUrl} />
					<SocialLinkInput placeholder="Artstation link" bind:value={$collectionData.artstationUrl} iconComponent={Artstation} bind:valid={$formValidity.artstationUrl} />
				</div>
			</div>

			{#if isNewCollection}
				<div class="flex flex-col w-1/2 pr-6">
					<h3 class="section-title">Blockchain</h3>
					<p class="my-3 section-subtext">Your Collection will be created on the following Blockchain:</p>
					<Dropdown options={blockchainOptions} disabled class="h-10" />
				</div>
			{/if}

			{#if isNewCollection}
				<div class="flex flex-col mt-16">
					<div class="section-title">Payment tokens</div>
					<p class="my-3 section-subtext">These tokens can be used to buy and sell your items.</p>
					<PaymentTokenCard symbol="WETH" name="Wrapped Ethereum" iconUrlOrComponent={EthV2} />
				</div>
			{/if}

			<!-- Explicit and sensitive content -->
			<div class="flex items-center mt-16">
				<div class="flex flex-col flex-grow">
					<div class="section-title">Explicit & Sensitive Content</div>
					<p class="my-3 section-subtext">Set this collection as explicit and sensitive content.</p>
				</div>
				<Toggle bind:state={$collectionData.isExplicitSenstive} />
			</div>

			{#if !formValid}
				<FormErrorList validity={$formValidity} />
			{/if}

			<button
				class="w-full h-11 2xl:h-14 border-gradient capitalize dullgradient text-white disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!formValid || savingCollection || !dataChanged}
				on:click={clickSaveCollection}
			>
				{#if isNewCollection}
					Create Collection
				{:else}
					Update collection
				{/if}
			</button>
		</div>
		{#if savingCollection}
			<Loader />
		{/if}
	</div>
</main>

<style lang="postcss">
	.section {
		@apply flex flex-row w-full;
	}
	.section-title {
		@apply font-medium text-base 2xl:text-xl leading-5 2xl:leading-6;
	}
	.section-subtext {
		@apply font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5;
	}
</style>
