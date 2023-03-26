<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;
	export let disabled = false;
	export let comingSoon = false;

	export let opened = false;
</script>

<div>
	<button
		class="w-full flex text-left h-14 px-6 items-center enabled:active:brightness-75 duration-50"
		class:opacity-50={disabled}
		on:click={() => (opened = !opened)}
		{disabled}
	>
		<div class="flex-grow">
			{title}
		</div>

		{#if comingSoon}
			<div class="mr-4">(Coming Soon)</div>
		{/if}

		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			class:rotate-180={opened}
			class="duration-200"
		>
			<path
				d="M6.4918 7.5625L11.9998 13.0585L17.5078 7.5625L19.1998 9.2545L11.9998 16.4545L4.7998 9.2545L6.4918 7.5625Z"
				fill="white"
			/>
		</svg>
	</button>

	{#if opened}
		<div transition:slide class="pt-6 px-2">
			<slot />
		</div>
	{/if}
</div>

<style>
	button {
		background: radial-gradient(
					55.65% 55.65% at 51.68% 130.43%,
					rgba(103, 212, 248, 0.025) 0%,
					rgba(142, 119, 247, 0.025) 100%
				)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(
					55.22% 148.72% at 98.83% 0%,
					rgba(103, 212, 248, 0.025) 0%,
					rgba(142, 119, 247, 0.025) 100%
				)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(
					64.35% 166.74% at 8.56% -7.83%,
					rgba(103, 212, 248, 0.025) 0%,
					rgba(142, 119, 247, 0.025) 100%
				)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(
				180deg,
				rgba(136, 234, 255, 0.1) 0%,
				rgba(133, 141, 247, 0.056) 100%,
				rgba(133, 141, 247, 0.1) 100%
			),
			rgba(0, 0, 0, 0.1);
	}
</style>
