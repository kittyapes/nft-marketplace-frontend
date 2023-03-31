<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBubble from '../InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '../PrimaryButton/PrimaryButton.svelte';

	export let showGotIt = true;
	export let clickable = true;

	let hovered = false;
	let iconContainer: HTMLElement;

	let clicked = false;

	function handleClick() {
		if (clickable) {
			clicked = !clicked;
		}
	}
</script>

<button
	on:pointerenter={() => (hovered = true)}
	on:pointerleave={() => (hovered = false)}
	on:click={handleClick}
	bind:this={iconContainer}
	class="active:brightness-50"
>
	<Info />
</button>

{#if (hovered && !clickable) || clicked}
	<AttachToElement to={iconContainer} offsetX={-20} offsetY={40}>
		<span class="!font-normal text-left normal-case">
			<InfoBubble gradientText={false} boldText={false}>
				<slot />

				<div class="flex justify-end mt-4">
					{#if showGotIt}
						<div>
							<PrimaryButton on:click={() => (clicked = false)}>Got it</PrimaryButton>
						</div>
					{/if}
				</div>
			</InfoBubble>
		</span>
	</AttachToElement>
{/if}
