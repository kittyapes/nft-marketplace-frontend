<script lang="ts">
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	// import TextArea from '$lib/components/TextArea.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Button from '$lib/components/Button.svelte';
	import { fade, slide } from 'svelte/transition';
	import Progressbar from '$lib/components/Progressbar.svelte';
	import { writable } from 'svelte/store';
	import { EditableProfileData, fetchProfileData, updateProfile } from '$utils/api/profile';
	import { currentUserAddress } from '$stores/wallet';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { browser } from '$app/env';
	import Loader from '$icons/loader.svelte';
	import { goto } from '$app/navigation';
	import { cloneDeep } from 'lodash-es';

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

			fetchAndDisplayProfile()
				.catch(() => notifyError('Failed to fetch new profile data.'))
				.then(() => {
					isSaving = false;
				});
		} catch (err) {
			notifyError('Could not save new profile data.');
			console.error(err);
		}
	}

	async function fetchAndDisplayProfile() {
		try {
			const data = await fetchProfileData($currentUserAddress);

			const localData = {
				username: data.username,
				email: data.email,
				bio: data.bio,
				instagram: data.instagram,
				facebook: data.facebook,
				twitter: data.twitter,
				imageUrl: data.imageUrl,
				coverUrl: data.coverUrl
			};

			fetchedDataStore.set(cloneDeep(localData));
			localDataStore.set(localData);

			if (data.username.includes('great_gatsby')) {
				firstTimeUser = true;
			}
		} catch (ex) {
			notifyError(ex.message);
		}
	}

	$: browser && $currentUserAddress && fetchAndDisplayProfile();
	$: profileCompletionProgress =
		$localDataStore &&
		($localDataStore.username ? 1 : 0) * 25 +
			($localDataStore.email ? 1 : 0) * 25 +
			($localDataStore.bio ? 1 : 0) * 25;

	// Go to home if the user's wallet isn't connected,
	// this is a temporary solution, we will solve this better
	// in the future globally
	browser &&
		setTimeout(() => {
			if (!$currentUserAddress) {
				goto('/');
			}
		}, 3000);
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

			{#if profileCompletionProgress === 100}
				<div class="px-16 mt-4">
					<button
						class="transition-btn
				bg-gradient-to-r from-color-purple to-color-blue
				text-white rounded-3xl font-semibold uppercase text-lg w-full
				py-6 block
				"
					>
						Claim your NFT
					</button>
				</div>
			{:else}
				<div class="w-4/5 mx-auto flex justify-end">
					<div class="font-bold gradient-text -translate-y-12">Free NFT</div>
				</div>
			{/if}

			<div id="form-container" class="grid grid-cols-2 gap-y-6 mt-12">
				<div>
					<div>Add your username</div>
					<div class="text-sm -mt-1">(Mandatory)</div>
				</div>

				<div class="w-full">
					<input
						type="text"
						class="input input-gray-outline"
						placeholder="Username"
						bind:value={$localDataStore.username}
					/>

					{#if usernameTaken}
						<div class="text-xs text-red-500 mt-2 ml-1" transition:slide|local>
							Username already taken
						</div>
					{/if}
				</div>

				<div>Add your email</div>
				<input
					type="text"
					class="input input-gray-outline"
					placeholder="example@email.com"
					bind:value={$localDataStore.email}
				/>

				<!-- <div>Add your bio</div>
				<TextArea
					outline
					placeholder="Enter your short bio"
					maxChars={200}
					bind:value={$localDataStore.bio}
				/> -->

				<div>Upload a <br /> profile image</div>
				<DragDropImage
					bind:blob={$localDataStore.profileImage}
					currentImgUrl={$fetchedDataStore.coverUrl}
				/>

				<!-- <div>Upload a <br /> background image</div>
				<DragDropImage /> -->

				<div>Social links</div>
				<div id="socials-container" class="grid gap-y-3">
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
				</div>
			</div>

			<Button
				rounded
				variant="rounded-black"
				stretch
				class="mt-12"
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
	/* Keep commented rules */

	#form-container > div {
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
</style>
