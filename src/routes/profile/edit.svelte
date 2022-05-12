<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '$icons/loader.svelte';
	import Artstation from '$icons/socials/artstation.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import Button from '$lib/components/Button.svelte';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import FreeNftPopup from '$lib/components/profile/FreeNFTPopup.svelte';
	import Progressbar from '$lib/components/Progressbar.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import { profileData, refreshProfileData } from '$stores/user';
	import { appSigner, currentUserAddress, welcomeNftClaimedOnChain, welcomeNftClaimedOnServer, welcomeNftMessage } from '$stores/wallet';
	import { hasClaimedFreeNft } from '$utils/api/freeNft';
	import { checkUsernameAvailability, EditableProfileData, updateProfile } from '$utils/api/profile';
	import { inputize } from '$utils/misc/inputize';
	import { setPopup } from '$utils/popup';
	import { httpErrorHandler, notifyError, notifySuccess } from '$utils/toast';
	import { isEmail } from '$utils/validator/isEmail';
	import checkIfWalletConnected from '$utils/wallet/checkIfWalletConnected';
	import { cloneDeep, debounce } from 'lodash-es';
	import type { UserData } from 'src/interfaces/userData';
	import { derived, writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { withPrevious } from 'svelte-previous';
	import { isUrl, urlPattern } from '$utils/validator/isUrl';
	import { isEqual } from 'lodash-es';

	const progressbarPoints = [
		{ at: 25, label: 'Email' },
		{ at: 50, label: 'Bio' },
		{ at: 75, label: 'Profile Image' },
		{ at: 100, label: 'Background Image', dot: false }
	];

	const fetchedDataStore = writable<EditableProfileData>(null);
	const localDataStore = writable<EditableProfileData>(null);

	$: dataChanged = JSON.stringify($fetchedDataStore) != JSON.stringify($localDataStore);

	let firstTimeUser = false;

	let pattern = urlPattern.toString();

	let isSaving = false;

	async function onSave() {
		if (isSaving) return;

		isSaving = true;

		if (!$localDataStore.username) {
			notifyError('Username is required.');
			return;
		}

		if ($localDataStore.email && !isEmail($localDataStore.email)) {
			notifyError('Please enter a valid email');
			return;
		}

		try {
			await updateProfile($currentUserAddress, $localDataStore);
			notifySuccess('Profile updated successfully.');

			refreshProfileData()
				.catch(() => notifyError('Failed to fetch new profile data.'))
				.then(() => {
					isSaving = false;

					// Once done, check if the user can claim free NFT
				});
		} catch (err) {
			httpErrorHandler(err);
			console.error(err);
			isSaving = false;
		}

		// Why? - Jakub
		await hasClaimedFreeNft($currentUserAddress);
	}

	async function useProfileData(data: UserData) {
		try {
			const localData = {
				username: data.username,
				email: data.email,
				bio: inputize(data.bio),
				instagram: data.instagram,
				discord: data.discord,
				twitter: data.twitter,
				imageUrl: data.imageUrl,
				coverUrl: data.coverUrl,
				profileImage: null,
				coverImage: null,
				website: data.website,
				pixiv: data.pixiv,
				deviantart: data.deviantart,
				artstation: data.artstation
			} as EditableProfileData;

			fetchedDataStore.set(cloneDeep(localData));
			localDataStore.set(localData);

			// We have to explicitly set this because reactive statements
			// do not react to changes in async functions.
			isProfileImage = localData.imageUrl;
			isCoverImage = localData.coverUrl;

			if (data.updatedAt === data.createdAt) {
				firstTimeUser = true;
			}
		} catch (ex) {
			console.error(ex);
			notifyError(ex.message);
		}
	}

	$: isProfileImage = $localDataStore?.profileImage || $localDataStore?.imageUrl;
	$: isCoverImage = $localDataStore?.coverImage || $localDataStore?.coverUrl;

	$: browser && $profileData && useProfileData($profileData);

	function isBioValid(bio: string) {
		return bio && bio.trim().split(' ').length > 2;
	}

	// map, join, indexOf ensures that the progressbar cannot be filled
	// in an incorrect order
	$: profileCompletionProgress =
		[isEmail($localDataStore?.email), isBioValid($localDataStore?.bio), isProfileImage, isCoverImage, 0]
			.map((v) => (v ? 1 : 0))
			.join('')
			.indexOf('0') * 25;

	async function handleNftClaim() {
		setPopup(FreeNftPopup);
	}

	// Username availability check
	const usernameAvailable = writable(null);
	const usernameValidLength = writable(null);
	const usernameValue = derived(localDataStore, ($localDataStore) => $localDataStore?.username);

	const debouncedCheckUsernameAvailability = debounce(async (username: string) => {
		$usernameAvailable = await checkUsernameAvailability(username);
	}, 500);

	usernameValue.subscribe(async (username) => {
		if (!browser || !username) {
			$usernameAvailable = true;
		} else if (username === $profileData.username) {
			$usernameAvailable = true;
		} else {
			await debouncedCheckUsernameAvailability(username);
		}

		$usernameValidLength = $profileData.updatedAt === $profileData.createdAt ? true : username?.length <= 25;
	});

	$: usernameValid = $usernameAvailable && $usernameValidLength;

	currentUserAddress.subscribe(async (address) => {
		try {
			if (address) {
				await hasClaimedFreeNft(address);
			}
		} catch (err) {
			console.log(err);
		}
	});

	$: isSynced = isEqual($fetchedDataStore, $localDataStore);

	// Bio validation
	function isValidBio(bio: string) {
		return bio && bio.trim().split(' ').length > 2;
	}

	$: bioValid = isValidBio($localDataStore?.bio) || !$localDataStore?.bio;
	$: websiteValid = browser && (!$localDataStore.website || isUrl($localDataStore.website));
	$: if (websiteValid) {
		// console.log(websiteValid);
	}

	// We setting false on SSR to avoid save button flashing
	$: dataValid = browser && $localDataStore.username && usernameValid && bioValid && websiteValid;

	const [currentAddress, previousAddress] = withPrevious('', { requireChange: true });
	$: $currentAddress = $currentUserAddress;

	$: browser && $currentAddress && $previousAddress && $currentAddress !== $previousAddress && goto('/profile');

	appSigner.subscribe((signer) => browser && checkIfWalletConnected(signer, $page.url.pathname));
</script>

<LoadedContent loaded={$localDataStore}>
	<div class="bg-[#f2f2f2] py-16">
		<div class="max-w-4xl mx-auto py-16 bg-white px-16">
			<h1 class="uppercase text-center text-5xl font-semibold">
				{firstTimeUser ? 'Setup' : 'Edit'} Your
				<span class="gradient-text">Profile</span>
			</h1>

			<div class="font-bold text-sm text-center mt-4">
				Profile completion progress: <span class="gradient-text">{profileCompletionProgress}%</span>
			</div>

			<div class="w-4/5 mx-auto">
				<Progressbar class="mt-2" value={profileCompletionProgress} points={progressbarPoints} />
			</div>

			<div class="relative w-full">
				{#if profileCompletionProgress !== 100}
					<div class="absolute font-bold gradient-text -translate-y-12 translate-x-[-100%] right-0" transition:fade|local>Free NFT</div>
				{/if}
			</div>

			{#if profileCompletionProgress === 100}
				<div class="px-16 mt-16" in:slide|local out:slide|local={{ delay: 300 }}>
					<button
						class="transition-btn
						bg-gradient-to-r from-color-purple to-color-blue
						text-white rounded-3xl font-semibold uppercase text-lg w-full
						py-6 block disabled:opacity-50"
						on:click={handleNftClaim}
						in:fade|local={{ delay: 300 }}
						out:fade|local
						disabled={isSaving || $welcomeNftClaimedOnChain || !isSynced}
					>
						Claim your NFT
					</button>
				</div>
			{/if}

			<div id="form-container" class="grid gap-y-6 mt-20">
				<div class="grid grid-cols-2">
					<div>
						<div class="input-label">Username</div>
						<div class="uppercase text-xs font-medium">Mandatory</div>
					</div>

					<div>
						<input type="text" class="input input-gray-outline" placeholder="Username" bind:value={$localDataStore.username} />

						{#if $usernameAvailable === false}
							<div class="text-xs ml-auto text-red-500 font-semibold mt-2 uppercase" transition:slide|local>Username already taken</div>
						{:else if $usernameValidLength === false}
							<div class="text-xs ml-auto text-red-500 font-semibold mt-2 uppercase" transition:slide|local>Username can't be longer than 25 characters</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2 items-stretch">
					<div
						class="input-label gradient-text brightness-0
						transition flex items-center"
						class:brightness-100={isEmail($localDataStore.email)}
					>
						Email
					</div>
					<div>
						<input type="email" class="input input-gray-outline" placeholder="example@email.com" bind:value={$localDataStore.email} />
						{#if $localDataStore.email && !isEmail($localDataStore.email)}
							<div transition:slide|local class="text-xs ml-auto text-red-500 font-semibold mt-2 uppercase" class:hidden={!$localDataStore.email || isEmail($localDataStore.email)}>
								Please enter a valid email address
							</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div class="input-label gradient-text brightness-0 transition" class:brightness-100={isBioValid($localDataStore.bio)}>Bio</div>

					<div>
						<TextArea outline placeholder="Enter your short bio" maxChars={200} bind:value={$localDataStore.bio} />
						{#if $localDataStore.bio && !isValidBio($localDataStore.bio)}
							<div class="text-xs ml-auto text-red-500 font-semibold uppercase -translate-y-3" transition:slide|local>Bio must be at least three words</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div>
						<div class="input-label gradient-text brightness-0 transition" class:brightness-100={isProfileImage}>
							PROFILE <br />
							PICTURE
						</div>
						<div class="text-xs text-[#A9A8A8]">gif, png, jpeg</div>
					</div>
					<div class="flex w-full flex-col">
						<DragDropImage bind:blob={$localDataStore.profileImage} currentImgUrl={$fetchedDataStore.imageUrl} dimensions="180x180 px" class="!w-48 !h-44 mx-auto" />
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div>
						<div class="input-label gradient-text brightness-0" class:brightness-100={isCoverImage}>BANNER</div>
						<div class="text-xs text-[#A9A8A8]">gif, png, jpeg</div>
					</div>
					<div class="flex w-full flex-col">
						<DragDropImage bind:blob={$localDataStore.coverImage} currentImgUrl={$fetchedDataStore.coverUrl} dimensions="2550x290 px" class="!h-24 !px-12" />
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div>
						<div class="input-label gradient-text brightness-0 peer-focus-within:brightness-100 transition">Social links</div>
						<div class="text-xs text-[#A9A8A8]">optional</div>
					</div>

					<div id="socials-container" class="grid gap-y-3 peer">
						<div>
							<Instagram />
							<input type="text" class="input input-gray-outline" placeholder="Instagram link" bind:value={$localDataStore.instagram} />
						</div>

						<div>
							<Discord />
							<input type="text" class="input input-gray-outline" placeholder="Discord link" bind:value={$localDataStore.discord} />
						</div>

						<div>
							<Twitter />
							<input type="text" class="input input-gray-outline" placeholder="Twitter link" bind:value={$localDataStore.twitter} />
						</div>

						<div>
							<Web />
							<input
								type="text"
								pattern={'^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?'}
								class="input input-gray-outline"
								placeholder="Personal Website"
								bind:value={$localDataStore.website}
							/>
						</div>

						<div>
							<Pixiv />
							<input type="text" class="input input-gray-outline" placeholder="Pixiv link" bind:value={$localDataStore.pixiv} />
						</div>

						<div>
							<Deviantart />
							<input type="text" class="input input-gray-outline" placeholder="Deviantart link" bind:value={$localDataStore.deviantart} />
						</div>

						<div>
							<Artstation />
							<input type="text" class="input input-gray-outline" placeholder="Artstation link" bind:value={$localDataStore.artstation} />
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center opacity-0 transition" class:opacity-100={isSaving}>
				<Loader class="w-6 h-6 mx-0" />
				<div class="font-semibold ml-4 uppercase">Saving changes...</div>
			</div>

			<Button rounded variant="rounded-black" stretch on:click={onSave} disabled={isSynced || !dataChanged || !dataValid} class="!font-medium">Save changes</Button>
		</div>
	</div>
</LoadedContent>

<style lang="postcss">
	.input-label {
		@apply uppercase text-xl font-medium;
	}

	#form-container input {
		@apply w-full;
		min-height: 3rem;
	}

	#socials-container > div {
		@apply flex gap-x-3 items-center;
	}

	#socials-container > div > :global(svg) {
		@apply h-12;
	}
</style>
