<script lang="ts">
	import Artstation from '$icons/socials/artstation.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';

	export let social: string;
	export let href: string;

	const socials = {
		twitter: {
			component: Twitter
		},
		instagram: {
			component: Instagram
		},
		discord: {
			component: Discord
		},
		website: {
			component: Web
		},
		pixiv: {
			component: Pixiv
		},
		deviantart: {
			component: Deviantart
		},
		artstation: {
			component: Artstation
		}
	};

	$: social_ = socials[social];
</script>

<a {href} target="_blank" class="transition-btn block">
	{#if social_?.component}
		<div class="w-8 h-8">
			<svelte:component this={social_.component} />
		</div>
	{/if}
</a>
