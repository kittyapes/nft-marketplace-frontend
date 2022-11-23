<script lang="ts">
	import Disconnect from '$icons/disconnect.svelte';
	import Artstation from '$icons/socials/artstation.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import { slide } from 'svelte/transition';
	import CreatorFormScreen from '$lib/components/CreatorFormScreen.svelte';
	import { isEmail } from '$utils/validator/isEmail';
	import TextArea from '$lib/components/TextArea.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { onMount } from 'svelte';

	let submissions: number = 1293;
	let name = '';
	let email = '';
	let instagram = '';
	let discord = '';
	let twitter = '';
	let personalEmail = '';
	let pixiv = '';
	let deviantart = '';
	let artstation = '';
	let contentStyle = '';
	let knowledgeDescription = '';

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
		<div slot="header" class="flex flex-col max-w-3xl gap-5">
			<h1 class="font-bold uppercase text-7xl">
				<p>Apply to be a</p>
				<p class="text-gradient">verified creator</p>
			</h1>
		</div>
		<div slot="content" id="form-container" class="flex flex-col max-w-xl gap-8">
			<button class="self-end text-sm uppercase text-color-black">
				<p class="flex gap-3">
					{submissions} submissions | Why become a verified creator?
					<Disconnect />
				</p>
			</button>
			<p class="mb-6 text-sm font-light">
				We are aiming to build a world class anime artist platform that gives artist more reach with their fans. We support artists when it comes to expanding their own brand and being able to access
				resources such as merchants to create physical goods, get access to commercial clients, and establish themselves as a metaverse creator who can earn perpetual fees from their original artwork
				using open-source NFT technology. 100% of minting costs on Ethereum are covered by the Hinata DAO.
			</p>
			<div class="grid grid-cols-[1fr_1.5fr]">
				<div class="text-lg uppercase text-gradient brightness-0" class:brightness-100={name}>Contact name</div>
				<input type="text" class="input input-gray-outline" placeholder="Legal name or alias" bind:value={name} />
			</div>
			<div class="grid grid-cols-[1fr_1.5fr] mb-2">
				<div class="text-lg uppercase text-gradient brightness-0" class:brightness-100={isEmail(email)}>Email</div>
				<div>
					<input type="text" class="input input-gray-outline" placeholder="example@email.com" bind:value={email} />
					{#if email && !isEmail(email)}
						<div transition:slide|local class="mt-2 ml-auto text-xs font-semibold text-red-500 uppercase" class:hidden={isEmail(email)}>Please enter a valid email address</div>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-[1fr_1.5fr] mb-8">
				<div>
					<div class="text-lg uppercase transition text-gradient brightness-0 peer-focus:brightness-100">Social links</div>
					<div class="text-xs text-[#A9A8A8]">optional</div>
				</div>

				<div id="socials-container" class="grid gap-y-3">
					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={instagram}>
							<Instagram {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Instagram link" bind:value={instagram} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={discord}>
							<Discord {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Discord link" bind:value={discord} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={twitter}>
							<Twitter {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Twitter link" bind:value={twitter} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={personalEmail}>
							<Web {gradient} />
						</div>
						<input type="email" class="input input-gray-outline" placeholder="Personal/Business Email" bind:value={personalEmail} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={pixiv}>
							<Pixiv {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Pixiv link" bind:value={pixiv} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={deviantart}>
							<Deviantart {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Deviantart link" bind:value={deviantart} />
					</div>

					<div>
						<div class="transition-all duration-300 brightness-0" class:brightness-100={artstation}>
							<Artstation {gradient} />
						</div>
						<input type="text" class="input input-gray-outline" placeholder="Artstation link" bind:value={artstation} />
					</div>
				</div>
			</div>
			<div class="grid grid-cols-[1fr_1.5fr]">
				<div class="uppercase text-lg input-label text-gradient brightness-0 transition max-w-[12rem]" class:brightness-100={isValidBio(contentStyle)}>what do you want to create?</div>

				<div>
					<TextArea outline placeholder="What are you most excited about?" maxChars={200} bind:value={contentStyle} />
					{#if contentStyle && !isValidBio(contentStyle)}
						<div class="ml-auto text-xs font-semibold text-red-500 uppercase -translate-y-3" transition:slide|local>Must be at least three words</div>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-[1fr_1.5fr]">
				<div class="uppercase text-lg input-label text-gradient brightness-0 transition max-w-[12rem]" class:brightness-100={isValidBio(knowledgeDescription)}>
					Have you minted NFts before? if so, where?
				</div>

				<div>
					<TextArea outline placeholder="Tell us about your level of knowledge!" maxChars={200} bind:value={knowledgeDescription} />
					{#if knowledgeDescription && !isValidBio(knowledgeDescription)}
						<div class="ml-auto text-xs font-semibold text-red-500 uppercase -translate-y-3" transition:slide|local>Must be at least three words</div>
					{/if}
				</div>
			</div>
			<button class="w-full mt-4 mb-10 text-sm font-normal uppercase btn btn-rounded btn-black">submit application</button>
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
		background: linear-gradient(white, white) padding-box, linear-gradient(to right, #868bf7, #6cc7f8) border-box;
		@apply border-transparent;
	}
</style>
