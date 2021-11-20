<script>
	export let title = '';
	export let iconSrc = '';

	import { slide } from 'svelte/transition';

	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);
</script>

<div>
	<div class="px-11 py-6 border-b border-gray-400 uppercase flex justify-between items-center">
		<div on:click={toggle} class=" w-full cursor-pointer flex items-center gap-3">
			<img src={iconSrc} alt="icon" />
			{title}
		</div>

		<button on:click={toggle} aria-expanded={isOpen}
			><svg
				width="14"
				height="8"
				viewBox="0 0 14 8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="transition-transform duration-200 ease-in"
			>
				<path
					d="M2.49922 0.400391L6.99922 4.90039L11.4992 0.400391L13.2992 1.30039L6.99922 7.60039L0.699219 1.30039L2.49922 0.400391Z"
					fill="#585858"
				/>
			</svg></button
		>
	</div>
	{#if isOpen}
		<div class="p-4 border-b border-gray-400" transition:slide={{ duration: 300 }}>
			<slot />
		</div>
	{/if}
</div>

<style>
	[aria-expanded='true'] svg {
		transform: rotate(0.5turn);
	}
</style>
