<script lang="ts">
	import { browser } from '$app/environment';
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
	import { appSigner, connectionDetails, currentUserAddress } from '$stores/wallet';
	import { freeNftStatus, hasClaimedFreeNft } from '$utils/api/freeNft';
	import { checkUsernameAvailability, type EditableProfileData, updateProfile } from '$utils/api/profile';
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
	import { isEqual } from 'lodash-es';
	import { acceptedImages } from '$constants';
	import isValidSocialLink, { type SupportedSocialNetworks } from '$utils/validator/isValidSocialLink';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';

	const progressbarPoints = [
		{ at: 20, label: 'Email', top_value: '25%', bottom_value: 'Email' },
		{ at: 40, label: 'Bio', top_value: '50%', bottom_value: 'Bio' },
		{ at: 60, label: 'Picture', top_value: '75%', bottom_value: 'Profile Image' },
		{ at: 80, label: 'Banner Image', top_value: '100%', bottom_value: 'Background Image' },
		{ at: 100, label: '', top_value: 'Free NFT' },
	];

	const fetchedDataStore = writable<EditableProfileData>(null);
	const localDataStore = writable<EditableProfileData>(null);

	$: dataChanged = JSON.stringify($fetchedDataStore) != JSON.stringify($localDataStore);

	const socialLinksValidity = writable<Partial<{ [K in keyof { [key in SupportedSocialNetworks]: string }]: any }>>({});

	let firstTimeUser = false;

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

			await refreshProfileData().catch(() => notifyError('Failed to fetch new profile data.'));
		} catch (err) {
			if (err.message.includes('User denied message signature')) {
				notifyError("You have denied wallet signature. Changes weren't saved.");
			} else {
				httpErrorHandler(err);
				console.error(err);
			}
		}

		hasClaimedFreeNft($currentUserAddress);

		isSaving = false;

		// force isSynced reactivity update
		$localDataStore = $localDataStore;
	}

	async function useProfileData(data: UserData) {
		try {
			const localData = {
				username: data.username,
				email: data.email,
				bio: inputize(data.bio),
				thumbnailUrl: data.thumbnailUrl,
				coverUrl: data.coverUrl,
				profileImage: null,
				coverImage: null,
				social: data.social || {
					instagram: '',
					discord: '',
					twitter: '',
					website: '',
					pixiv: '',
					deviantart: '',
					artstation: '',
				},
			} as EditableProfileData;

			fetchedDataStore.set(cloneDeep(localData));
			localDataStore.set(localData);

			// We have to explicitly set this because reactive statements
			// do not react to changes in async functions.
			isProfileImage = localData.thumbnailUrl;
			isCoverImage = localData.coverUrl;

			if (data.updatedAt === data.createdAt) {
				firstTimeUser = true;
			}
		} catch (ex) {
			console.error(ex);
			notifyError(ex.message);
		}
	}

	$: isProfileImage = $localDataStore?.profileImage || $localDataStore?.thumbnailUrl;
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

	$: progressBarValue =
		[isEmail($localDataStore?.email), isBioValid($localDataStore?.bio), isProfileImage, isCoverImage, 0]
			.map((v) => (v ? 1 : 0))
			.join('')
			.indexOf('0') * 20;

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

		if (!username) return;

		// Do not scream at the user about invalid username length if they are a first time user
		// and have not yet entered a username
		if ($profileData?.updatedAt === $profileData?.createdAt && username?.length === 0) {
			$usernameValidLength = true;
		} else {
			$usernameValidLength = username.length <= 25;
		}
	});

	$: usernameValid = $localDataStore?.username && $usernameAvailable && $usernameValidLength;

	$: isSynced = isEqual($fetchedDataStore, $localDataStore);

	// Bio validation
	function isValidBio(bio: string) {
		return bio && bio.trim().split(' ').length > 2;
	}

	$: bioValid = isValidBio($localDataStore?.bio) || !$localDataStore?.bio;
	$: if (browser && $localDataStore?.social) {
		Object.keys($localDataStore.social).map((item: SupportedSocialNetworks) => {
			$socialLinksValidity[item] = $localDataStore.social[item].trim() ? (!isValidSocialLink($localDataStore.social[item], item).isValid ? `Please enter a valid url for your ${item}` : true) : true;
		});
	}

	// We setting false on SSR to avoid save button flashing
	$: dataValid =
		browser &&
		$localDataStore?.username &&
		usernameValid &&
		($localDataStore?.bio ? bioValid : true) &&
		!Object.entries($socialLinksValidity).some((item) => !item[1] || typeof item[1] === 'string') &&
		isEmail($localDataStore?.email);

	const [currentAddress, previousAddress] = withPrevious('', { requireChange: true });
	$: $currentAddress = $currentUserAddress;

	$: browser && $currentAddress && $previousAddress && $currentAddress !== $previousAddress && goto('/profile');

	appSigner.subscribe((signer) => browser && checkIfWalletConnected(signer, $page.url.pathname));

	// Free NFT claiming
	$: $connectionDetails && hasClaimedFreeNft($currentAddress);
</script>

<LoadedContent loaded={$localDataStore}>
	<div class="py-16">
		<div class="max-w-4xl px-16 py-16 mx-auto text-white">
			<h1 class="text-5xl font-semibold text-center uppercase">
				{firstTimeUser ? 'Setup' : 'Edit'} Your
				<span class="text-gradient">Profile</span>
			</h1>

			<div class="mt-4 text-sm text-center">
				Profile completion progress: <span class="text-gradient">{profileCompletionProgress}%</span>
			</div>

			<div class="w-4/5 mx-auto mt-14">
				<Progressbar class="mt-2" value={progressBarValue} points={progressbarPoints} />
			</div>

			{#if $freeNftStatus !== 'claimed'}
				<div class="px-16 mt-16" in:slide|local out:slide|local={{ delay: 300 }}>
					<button
						class="block w-full py-6 text-lg font-semibold text-white uppercase transition-btn bg-gradient-to-r from-color-purple to-color-blue rounded-3xl disabled:opacity-50"
						on:click={handleNftClaim}
						in:fade|local={{ delay: 300 }}
						out:fade|local
						disabled={isSaving || $freeNftStatus === 'unclaimable'}
					>
						<!-- {@debug isSaving, $freeNftStatus, isSynced} -->
						Claim your NFT
					</button>
				</div>
			{/if}

			<div id="form-container" class="grid mt-20 gap-y-6">
				<div class="grid grid-cols-2">
					<div class="input-label" class:text-gradient={usernameValid}>Username</div>

					<div>
						<input type="text" class="input " placeholder="Username" bind:value={$localDataStore.username} />

						{#if $usernameAvailable === false}
							<div class="mt-2 ml-auto text-xs font-semibold text-red-500 uppercase" transition:slide|local>Username already taken</div>
						{:else if $usernameValidLength === false}
							<div class="mt-2 ml-auto text-xs font-semibold text-red-500 uppercase" transition:slide|local>Username can't be longer than 25 characters</div>
						{/if}
					</div>
				</div>

				<div class="grid items-stretch grid-cols-2">
					<div class="flex items-center transition input-label">
						<div class:text-gradient={isEmail($localDataStore.email)}>Email</div>
					</div>
					<div>
						<input type="email" class="input " placeholder="example@email.com" bind:value={$localDataStore.email} />
						{#if $localDataStore.email && !isEmail($localDataStore.email)}
							<div transition:slide|local class="mt-2 ml-auto text-xs font-semibold text-red-500 uppercase" class:hidden={!$localDataStore.email || isEmail($localDataStore.email)}>
								Please enter a valid email address
							</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2 items-start">
					<div class="flex items-center transition input-label">
						<div class:text-gradient={$localDataStore.bio && isValidBio($localDataStore.bio)}>Bio</div>
					</div>

					<div>
						<TextArea placeholder="Enter your short bio" maxChars={200} bind:value={$localDataStore.bio} />
						{#if $localDataStore.bio && !isValidBio($localDataStore.bio)}
							<div class="ml-auto text-xs font-semibold text-red-500 uppercase" transition:slide|local>Bio must be at least three words</div>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2 items-start">
					<div class="input-label flex">
						<div class="transition">
							<div class="flex flex-col">
								<div class:text-gradient={isProfileImage}>PROFILE</div>
								<div class:text-gradient={isProfileImage}>PICTURE</div>
							</div>
						</div>
					</div>
					<div class="flex flex-col w-full">
						<DragDropImage
							max_file_size={5_000_000}
							bind:blob={$localDataStore.profileImage}
							currentImgUrl={$fetchedDataStore?.thumbnailUrl}
							acceptedFormats={acceptedImages}
							dimensions="200 X 200 PX Max 5MB"
							class="!w-48 !h-44 mx-auto"
						>
							<div class="flex flex-col gap-2 items-center" slot="placeholder">
								<span>Drag and drop an image here or click to browse</span>
								<div class="text-gradient">GIF, PNG, JPEG</div>
							</div>
							<div class="text-xs mt-2 text-white flex justify-center" slot="lower_text">
								<span class="text-center">
									We recommend an image of atleast <span class="text-gradient">200 x 200 PX</span>
									| GIFs work too.
									<span class="text-gradient">Max 5MB</span>
								</span>
							</div>
						</DragDropImage>
					</div>
				</div>

				<div class="grid grid-cols-2 items-start">
					<div class=" input-label flex">
						<div class="input-label">
							<div class:text-gradient={isCoverImage}>BANNER</div>
						</div>
					</div>
					<div class="flex flex-col w-full">
						<DragDropImage
							max_file_size={10_000_000}
							bind:blob={$localDataStore.coverImage}
							currentImgUrl={$fetchedDataStore?.coverUrl}
							acceptedFormats={acceptedImages}
							dimensions="2550 x 290 px"
							class="!h-24 !px-12"
						>
							<div class="flex flex-col gap-2 items-center" slot="placeholder">
								<span>Drag and drop an image here or click to browse</span>
								<div class="text-gradient">GIF, PNG, JPEG</div>
							</div>
							<div class="text-gradient text-xs mt-2" slot="lower_text">2550 x 290 PX</div>
						</DragDropImage>
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div class="transition input-label text-white peer-focus-within:brightness-100">Social links</div>

					<div id="socials-container" class="grid gap-y-3 peer text-white">
						<div>
							<Instagram class="w-14 h-14" />
							<input type="text" class="input " placeholder="Instagram link" bind:value={$localDataStore.social.instagram} />
						</div>

						<div>
							<Discord class="w-14 h-14" />
							<input type="text" class="input " placeholder="Discord link" bind:value={$localDataStore.social.discord} />
						</div>

						<div>
							<Twitter class="w-14 h-14" />
							<input type="text" class="input " placeholder="Twitter link" bind:value={$localDataStore.social.twitter} />
						</div>

						<div>
							<Web class="w-14 h-14" />
							<input
								type="text"
								pattern={'^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?'}
								class="input "
								placeholder="Personal Website"
								bind:value={$localDataStore.social.website}
							/>
						</div>

						<div>
							<Pixiv class="w-14 h-14" />
							<input type="text" class="input" placeholder="Pixiv link" bind:value={$localDataStore.social.pixiv} />
						</div>

						<div>
							<Deviantart class="w-14 h-14" />
							<input type="text" class="input" placeholder="Deviantart link" bind:value={$localDataStore.social.deviantart} />
						</div>

						<div>
							<Artstation class="w-14 h-14" />
							<input type="text" class="input" placeholder="Artstation link" bind:value={$localDataStore.social.artstation} />
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center transition opacity-0" class:opacity-100={isSaving}>
				<Loader class="w-6 h-6 mx-0" />
				<div class="ml-4 font-semibold uppercase">Saving changes...</div>
			</div>

			<FormErrorList validity={$socialLinksValidity} class="mb-10 -mt-10" />

			<PrimaryButton on:click={onSave} disabled={isSynced || !dataChanged || !dataValid || isSaving} class="text-lg">Save changes</PrimaryButton>
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
