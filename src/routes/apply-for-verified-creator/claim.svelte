<script lang="ts">
    import Disconnect from "$icons/disconnect.svelte";
    import CreatorFormScreen from "$lib/components/CreatorFormScreen.svelte";
    import { checkUsernameAvailability } from "$utils/api/profile";
    import { debounce } from "lodash-es";
    import { slide } from 'svelte/transition';
    import TextArea from "$lib/components/TextArea.svelte";
    import DragDropImage from "$lib/components/DragDropImage.svelte";
    import { onMount } from "svelte";
import LoadedContent from "$lib/components/LoadedContent.svelte";
    
    export let namesClaimed = 323;
    export let username = '';
    export let bio = '';
    export let profileImageUrl = '';
    export let profileImage: Blob;
    export let profileBannerUrl = '';
    export let profileBanner: Blob;

    let usernameAvailable = true;
    let loaded: boolean = false;
    
    onMount(() => {
        setTimeout(() => loaded = true, 500);
    });

    const debouncedCheckUsernameAvailability = debounce(async (username: string) => {
		usernameAvailable = await checkUsernameAvailability(username);
	}, 500);

    function isValidBio(bio: string) {
		return bio && bio.trim().split(' ').length > 2;
	}
</script>

<LoadedContent {loaded}>
    <CreatorFormScreen step={2}>
        <div slot='header' class='flex flex-col gap-5 max-w-3xl'>
            <h1 class='uppercase font-bold text-7xl'>
                <p>Claim your</p>
                <p class='gradient-text'>artist profile</p>
            </h1>
        </div>
        <div slot='content' id="form-container" class='flex flex-col max-w-xl gap-8'>
            <button class='text-color-black text-sm uppercase self-end'>
                <p class='flex gap-3'>
                    {namesClaimed} Names Claimed | How does this work?
                    <Disconnect></Disconnect>
                </p>
            </button>
            <p class='text-sm font-light mb-6'>You will need to connect sign a free and secure message on the Ethereum network in order to save your profile information. You must connect a web3-enabled wallet such as MetaMask to do this. </p>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div>
                    <div class="uppercase text-lg gradient-text brightness-0" class:brightness-100={username}>Username</div>
                    <div class="text-xs font-medium">mandatory</div>
                </div>
                <div>
                    <input
                        type="text"
                        class="input input-gray-outline"
                        placeholder="BigToeLarry"
                        bind:value={username}
                    />
                    {#if usernameAvailable === false}
                        <div
                            class="text-xs ml-auto text-red-500 font-semibold mt-2 uppercase"
                            transition:slide|local
                        >
                            Username already taken
                        </div>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div class="transition max-w-[12rem]">
                    <div class='uppercase gradient-text brightness-0' class:brightness-100={isValidBio(bio)}>Bio</div>
                    <div class="text-xs font-medium text-[#A9A8A8]">optional</div>
                </div>

                <div>
                    <TextArea
                        outline
                        placeholder="Enter your short bio "
                        maxChars={200}
                        bind:value={bio}
                    />
                    {#if bio && !isValidBio(bio)}
                        <div
                            class="text-xs ml-auto text-red-500 font-semibold uppercase -translate-y-3"
                            transition:slide|local
                        >
                        Bio must be at least three words
                        </div>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div>
                    <div class="uppercase text-lg gradient-text brightness-0 max-w-[5rem]" class:brightness-100={profileImage}>profile picture</div>
                    <div class="text-xs font-medium text-[#A9A8A8]">gif, png, jpeg</div>
                </div>
                <div class="flex w-full flex-col">
                    <DragDropImage
                        bind:blob={profileImage}
                        currentImgUrl={profileImageUrl}
                        dimensions="180x180 PX"
                        class="!w-48 !h-44 mx-auto"
                    />
                </div>
            </div>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div>
                    <div class="uppercase text-lg gradient-text brightness-0 max-w-[5rem]" class:brightness-100={profileBanner}>banner</div>
                    <div class="text-xs font-medium text-[#A9A8A8]">png, jpeg</div>
                </div>
                <div class="flex w-full flex-col">
                    <DragDropImage
                        bind:blob={profileBanner}
                        currentImgUrl={profileBannerUrl}
                        dimensions="2550x290 PX"
                        class="!w-full !h-20 mx-auto"
                    />
                </div>
            </div>
            <button class='w-full btn btn-rounded btn-black uppercase font-normal text-sm mt-8 mb-10'>Claim username</button>
    </CreatorFormScreen>
</LoadedContent>

<style lang="postcss">

    #form-container input {
		@apply w-full transition-opacity;
		min-height: 3rem;
	}

    input:focus {
        background: 
            linear-gradient(white, white) padding-box,
            linear-gradient(to right, #868BF7, #6CC7F8) border-box ;
        @apply border-transparent;
    }
</style>