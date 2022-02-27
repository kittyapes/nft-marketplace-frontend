<script lang="ts">
    import Disconnect from "$icons/disconnect.svelte";
    import CreatorFormScreen from "$lib/components/CreatorFormScreen.svelte";
    import { checkUsernameAvailability } from "$utils/api/profile";
    import { debounce } from "lodash-es";
    import { slide } from 'svelte/transition';

    
    export let namesClaimed = 323;
    export let username = '';

    let usernameAvailable = false;

    const debouncedCheckUsernameAvailability = debounce(async (username: string) => {
		usernameAvailable = await checkUsernameAvailability(username);
	}, 500);
</script>

<CreatorFormScreen>
    <div slot='header' class='flex flex-col gap-5 max-w-3xl'>
        <h1 class='uppercase font-bold text-7xl'>
            <p>Claim your</p>
            <p class='gradient-text'>artist profile</p>
        </h1>
        <button class='text-color-black text-sm uppercase mb-4 self-center'>
            <p class='flex gap-3'>
                {namesClaimed} Names Claimed | How does this work?
                <Disconnect></Disconnect>
            </p>
        </button>
    </div>
    <div slot='content' id="form-container" class='flex flex-col max-w-xl gap-8'>
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
</CreatorFormScreen>

<style lang="postcss">
    #socials-container > div {
        @apply flex gap-x-3 items-center;
    }

    #socials-container > div > :global(svg) {
        @apply h-12;
    }

    #form-container input {
		@apply w-full;
		min-height: 3rem;
	}

    input:focus {
        background: 
            linear-gradient(white, white) padding-box,
            linear-gradient(to right, #868BF7, #6CC7F8) border-box ;
        @apply border-transparent;
    }
</style>