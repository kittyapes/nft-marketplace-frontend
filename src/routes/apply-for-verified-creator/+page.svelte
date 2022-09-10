<script lang="ts">
    throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

    import Disconnect from "$icons/disconnect.svelte";
    import Artstation from "$icons/socials/artstation.svelte";
    import Deviantart from "$icons/socials/deviantart.svelte";
    import Discord from "$icons/socials/discord.svelte";
    import Instagram from "$icons/socials/instagram.svelte";
    import Pixiv from "$icons/socials/pixiv.svelte";
    import Twitter from "$icons/socials/twitter.svelte";
    import Web from "$icons/socials/web.svelte";
    import { slide } from 'svelte/transition';
    import CreatorFormScreen from "$lib/components/CreatorFormScreen.svelte";
    import { isEmail } from "$utils/validator/isEmail";
    import TextArea from "$lib/components/TextArea.svelte";
    import LoadedContent from "$lib/components/LoadedContent.svelte";
    import { onMount } from "svelte";

    export let submissions: number = 1293;
    export let name = '';
    export let email = '';
    export let instagram = '';
    export let discord = '';
    export let twitter = '';
    export let personalEmail = '';
    export let pixiv = '';
    export let deviantart = '';
    export let artstation = '';
    export let contentStyle = '';
    export let knowledgeDescription = '';

    let loaded: boolean = false;
    let gradient = true;
    
    onMount(() => {
        loaded = true;
    });

    function isValidBio(bio: string) {
		return bio && bio.trim().split(' ').length > 2;
	}

</script>


<LoadedContent {loaded}>
    <CreatorFormScreen step={1}>
        <div slot='header' class='flex flex-col gap-5 max-w-3xl'>
            <h1 class='uppercase font-bold text-7xl'>
                <p>Apply to be a</p>
                <p class='gradient-text'>verified creator</p>
            </h1>
        </div>
        <div slot='content' id="form-container" class='flex flex-col max-w-xl gap-8'>
            <button class='text-color-black text-sm uppercase self-end'>
                <p class='flex gap-3'>
                    {submissions} submissions | Why become a verified creator?
                    <Disconnect></Disconnect>
                </p>
            </button>
            <p class='text-sm font-light mb-6'>We are aiming to build a world class anime artist platform that gives artist more reach with their fans. We support artists when it comes to expanding their own brand and being able to access resources such as merchants to create physical goods, get access to commercial clients, and establish themselves as a metaverse creator who can earn perpetual fees from their original artwork using open-source NFT technology. 100% of minting costs on Ethereum are covered by the Hinata DAO.</p>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div class="uppercase text-lg gradient-text brightness-0" class:brightness-100={name}>Contact name</div>
                <input
                    type="text"
                    class="input input-gray-outline"
                    placeholder="Legal name or alias"
                    bind:value={name}
                />
            </div>
            <div class="grid grid-cols-[1fr_1.5fr] mb-2">
                <div class="uppercase text-lg gradient-text brightness-0" class:brightness-100={isEmail(email)}>Email</div>
                    <div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="example@email.com"
                            bind:value={email}
                        />
                        {#if email && !isEmail(email)}
                            <div
                                transition:slide|local
                                class="text-xs ml-auto text-red-500 font-semibold mt-2 uppercase"
                                class:hidden={isEmail(email)}
                            >
                                Please enter a valid email address
                            </div>
                        {/if}
                    </div>
                </div>
            <div class="grid grid-cols-[1fr_1.5fr] mb-8">
                <div>
                    <div
                        class="text-lg uppercase gradient-text brightness-0 peer-focus:brightness-100 transition"
                    >
                        Social links
                    </div>
                    <div class="text-xs text-[#A9A8A8]">optional</div>
                </div>

                <div id="socials-container" class="grid gap-y-3">
                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={instagram}>
                            <Instagram {gradient} />
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Instagram link"
                            bind:value={instagram}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={discord}>
                            <Discord {gradient}/>
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Discord link"
                            bind:value={discord}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={twitter}>
                            <Twitter {gradient}/>
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Twitter link"
                            bind:value={twitter}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={personalEmail}>
                            <Web {gradient}/>
                        </div>
                        <input
                            type="email"
                            class="input input-gray-outline"
                            placeholder="Personal/Business Email"
                            bind:value={personalEmail}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={pixiv}>
                            <Pixiv {gradient} />
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Pixiv link"
                            bind:value={pixiv}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={deviantart}>
                            <Deviantart {gradient}/>
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Deviantart link"
                            bind:value={deviantart}
                        />
                    </div>

                    <div>
                        <div class='brightness-0 transition-all duration-300' class:brightness-100={artstation}>
                            <Artstation {gradient}/>
                        </div>
                        <input
                            type="text"
                            class="input input-gray-outline"
                            placeholder="Artstation link"
                            bind:value={artstation}
                        />
                    </div>
                </div>

            </div>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div
                    class="uppercase text-lg input-label gradient-text brightness-0 transition max-w-[12rem]"
                    class:brightness-100={isValidBio(contentStyle)}
                >
                    what do you want 
                    to create?
                </div>

                <div>
                    <TextArea
                        outline
                        placeholder="What are you most excited about?"
                        maxChars={200}
                        bind:value={contentStyle}
                    />
                    {#if contentStyle && !isValidBio(contentStyle)}
                        <div
                            class="text-xs ml-auto text-red-500 font-semibold uppercase -translate-y-3"
                            transition:slide|local
                        >
                        Must be at least three words
                        </div>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-[1fr_1.5fr]">
                <div
                    class="uppercase text-lg input-label gradient-text brightness-0 transition max-w-[12rem]"
                    class:brightness-100={isValidBio(knowledgeDescription)}
                >
                    Have you minted 
                    NFts before?
                    if so, where?
                </div>

                <div>
                    <TextArea
                        outline
                        placeholder="Tell us about your level of knowledge!"
                        maxChars={200}
                        bind:value={knowledgeDescription}
                    />
                    {#if knowledgeDescription && !isValidBio(knowledgeDescription)}
                        <div
                            class="text-xs ml-auto text-red-500 font-semibold uppercase -translate-y-3"
                            transition:slide|local
                        >
                            Must be at least three words
                        </div>
                    {/if}
                </div>
            </div>
            <button class='w-full btn btn-rounded btn-black uppercase font-normal text-sm mt-4 mb-10'>submit application</button>
        </div>
    </CreatorFormScreen>
</LoadedContent>

<style lang="postcss">
    #socials-container > div {
        @apply flex gap-x-3 items-center;
    }

    #socials-container > div > div > :global(svg) {
        @apply h-12;
    }

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