<script lang="ts">
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Button from '$lib/components/Button.svelte';
	import { fade, slide } from 'svelte/transition';
	import Progressbar from '$lib/components/Progressbar.svelte';
	import { writable } from 'svelte/store';
	import { EditableProfileData, ProfileData, updateProfile } from '$utils/api/profile';
	import { currentUserAddress, welcomeNftClaimed } from '$stores/wallet';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { browser } from '$app/env';
	import Loader from '$icons/loader.svelte';
	import { goto } from '$app/navigation';
	import { cloneDeep } from 'lodash-es';
	import { profileData, refreshProfileData } from '$stores/user';
	import { setPopup } from '$utils/popup';
	import FreeNftPopup from '$lib/components/profile/FreeNFTPopup.svelte';
	import Web from '$icons/socials/web.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Artstation from '$icons/socials/artstation.svelte';

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

	// $: usernameTaken = $localDataStore?.username;
	$: usernameTaken = false;

	let isSaving = false;

	const isEmail = (email: string) => {
		return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
			email
		);
	};

	async function onSave() {
		if (isSaving) return;

		isSaving = true;

		if (!$localDataStore.username) {
			notifyError('Username is required.');
			return;
		}

		try {
			await updateProfile($currentUserAddress, $localDataStore);
			notifySuccess('Profile updated successfully.');

			refreshProfileData()
				.catch(() => notifyError('Failed to fetch new profile data.'))
				.then(() => {
					isSaving = false;
				});
		} catch (err) {
			notifyError('Could not save new profile data.');
			console.error(err);
			isSaving = false;
		}
	}

	async function useProfileData(data: ProfileData) {
		try {
			const localData = {
				username: data.username,
				email: data.email,
				bio: data.bio,
				instagram: data.instagram,
				facebook: data.facebook,
				twitter: data.twitter,
				imageUrl: data.imageUrl,
				coverUrl: data.coverUrl,
				profileImage: null,
				coverImage: null,
				socialEmail: data.socialEmail,
				pixiv: data.pixiv,
				deviantart: data.deviantart,
				artstation: data.artstation
			} as EditableProfileData;

			fetchedDataStore.set(cloneDeep(localData));
			localDataStore.set(localData);

			if (data.username.includes('great_gatsby')) {
				firstTimeUser = true;
			}

			isProfileImage = !!($localDataStore?.profileImage || $localDataStore?.imageUrl);
			isCoverImage = !!($localDataStore?.coverImage || $localDataStore?.coverUrl);
		} catch (ex) {
			notifyError(ex.message);
		}
	}

	let isProfileImage = false;
	let isCoverImage = false;

	$: browser && $profileData && useProfileData($profileData);
	$: profileCompletionProgress =
		[$localDataStore?.email, $localDataStore?.bio, isProfileImage, isCoverImage].filter((v) => !!v)
			.length * 25;

	// Go to home if the user's wallet isn't connected,
	// this is a temporary solution, we will solve this better
	// in the future globally
	browser &&
		setTimeout(() => {
			if (!$currentUserAddress) {
				goto('/');
			}
		}, 3000);

	async function handleNftClaim() {
		if (dataChanged) {
			await onSave();
		}

		setPopup(FreeNftPopup);
	}
</script>

{#if $localDataStore}
	<div class="bg-[#f2f2f2] py-16" in:fade>
		<div class="max-w-4xl mx-auto py-16 bg-white px-16">
			<h1 class="uppercase text-center text-5xl font-semibold">
				{firstTimeUser ? 'Setup' : 'Edit'} Your <span class="gradient-text">Profile</span>
			</h1>

			<div class="font-bold text-sm text-center mt-4">
				Profile completion progress: <span class="gradient-text">{profileCompletionProgress}%</span>
			</div>

			<div class="w-4/5 mx-auto">
				<Progressbar class="mt-2" value={profileCompletionProgress} points={progressbarPoints} />
			</div>

			<div class="relative w-full">
				{#if profileCompletionProgress !== 100}
					<div
						class="absolute font-bold gradient-text -translate-y-12 translate-x-[-100%] right-0"
						transition:fade|local
					>
						Free NFT
					</div>
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
						disabled={isSaving || $welcomeNftClaimed}
					>
						Claim your NFT
					</button>
				</div>
			{/if}

			<div id="form-container" class="grid gap-y-6 mt-16">
				<div class="grid grid-cols-2">
					<div>
						<div class="input-label">Username</div>
						<div class="tagline uppercase">Mandatory</div>
					</div>

					<input
						type="text"
						class="input input-gray-outline"
						placeholder="Username"
						bind:value={$localDataStore.username}
					/>
				</div>

				{#if usernameTaken}
					<div
						class="text-xs w-1/2 ml-auto text-red-500 font-semibold -mt-4 uppercase"
						transition:slide|local
					>
						Username already taken
					</div>
				{/if}

				<div class="grid grid-cols-2 items-stretch">
					<div
						class="input-label gradient-text brightness-0
						transition flex items-center"
						class:brightness-100={$localDataStore.email}
					>
						Email
					</div>
					<div>
						<input
							type="email"
							class="input input-gray-outline"
							placeholder="example@email.com"
							bind:value={$localDataStore.email}
						/>
						<div
							class="error"
							class:hidden={!$localDataStore.email || isEmail($localDataStore.email)}
						>
							Please enter a valid email address
						</div>
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div
						class="input-label gradient-text brightness-0 transition"
						class:brightness-100={$localDataStore.bio}
					>
						Bio
					</div>
					<TextArea
						outline
						placeholder="Enter your short bio"
						maxChars={200}
						bind:value={$localDataStore.bio}
					/>
				</div>

				<div class="grid grid-cols-2">
					<div
						class="input-label gradient-text brightness-0 transition"
						class:brightness-100={isProfileImage}
					>
						PROFILE <br /> PICTURE
						<div class="tagline">gif, png, jpg</div>
					</div>
					<div class="flex w-full flex-col">
						<DragDropImage
							bind:blob={$localDataStore.profileImage}
							currentImgUrl={$fetchedDataStore.imageUrl}
						/>
						<div class="tagline w-full mt-2 text-center">180x180 px</div>
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div class="input-label gradient-text brightness-0" class:brightness-100={isCoverImage}>
						BANNER
						<div class="tagline">png, jpg</div>
					</div>
					<div class="flex w-full flex-col">
						<DragDropImage
							bind:blob={$localDataStore.coverImage}
							currentImgUrl={$fetchedDataStore.coverUrl}
						/>
						<div class="tagline w-full mt-2 text-center">2550x290 px</div>
					</div>
				</div>

				<div class="grid grid-cols-2">
					<div id="socials-container" class="grid gap-y-3 peer">
						<div>
							<Instagram />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Instagram link"
								bind:value={$localDataStore.instagram}
							/>
						</div>

						<div>
							<Facebook />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Facebook link"
								bind:value={$localDataStore.facebook}
							/>
						</div>

						<div>
							<Twitter />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Twitter link"
								bind:value={$localDataStore.twitter}
							/>
						</div>

						<div>
							<Web />
							<input
								type="email"
								class="input input-gray-outline"
								placeholder="Personal/Business Email"
								bind:value={$localDataStore.socialEmail}
							/>
						</div>

						<div>
							<Pixiv />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Pixiv link"
								bind:value={$localDataStore.pixiv}
							/>
						</div>

						<div>
							<Deviantart />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Deviantart link"
								bind:value={$localDataStore.deviantart}
							/>
						</div>

						<div>
							<Artstation />
							<input
								type="text"
								class="input input-gray-outline"
								placeholder="Artstation link"
								bind:value={$localDataStore.artstation}
							/>
						</div>
					</div>

					<div
						class="input-label gradient-text brightness-0 peer-focus-within:brightness-100
						order-first transition"
					>
						Social links
						<div class="tagline gray-text">optional</div>
					</div>
				</div>
			</div>

			<div class="flex items-center opacity-0 mt-12 transition" class:opacity-100={isSaving}>
				<Loader class="w-6 h-6 mx-0" />
				<div class="font-semibold ml-4 uppercase">Saving changes...</div>
			</div>

			<Button
				rounded
				variant="rounded-black"
				stretch
				on:click={onSave}
				disabled={isSaving || !dataChanged}
			>
				Save changes
			</Button>
		</div>
	</div>
{:else}
	<div class="py-64">
		<Loader />
	</div>
{/if}

<style lang="postcss">
	.input-label {
		@apply uppercase text-lg font-medium;
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

	.tagline {
		@apply text-color-gray-accent text-[10px] lowercase;
	}

	.gray-text {
		color: #a9a8a8 !important;
	}

	.error {
		@apply text-red-300 uppercase text-[10px] mt-2;
	}
</style>
