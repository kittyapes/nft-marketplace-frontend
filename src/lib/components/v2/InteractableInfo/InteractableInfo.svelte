<script lang="ts">
	import { browser } from '$app/environment';
	import Info from '$icons/info.v2.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import { onDestroy, onMount } from 'svelte';
	import InfoBubble from '../InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '../PrimaryButton/PrimaryButton.svelte';
	import { lastInstanceId, openedInstanceId } from './InteractableInfo';

	export let showGotIt = true;
	export let clickable = true;

	let hovered = false;
	let iconContainer: HTMLElement;

	let opened = false;

	let recalcHelper: number;

	function open() {
		opened = true;
		$openedInstanceId = instanceId;

		document.addEventListener('scroll', recalc);
		addEventListener('resize', recalc);
	}

	function close() {
		opened = false;

		if ($openedInstanceId === instanceId) {
			$openedInstanceId = null;
		}

		document.removeEventListener('scroll', recalc);
		removeEventListener('resize', recalc);
	}

	function recalc() {
		recalcHelper++;
	}

	let instanceId: number = null;

	onMount(() => {
		$lastInstanceId++;
		instanceId = $lastInstanceId;
	});

	// Close current component instance if a new instance has been created somewhere
	$: if (instanceId && instanceId != $openedInstanceId && opened) {
		close();
	}

	onDestroy(() => {
		if (browser) {
			close();
		}
	});
</script>

<button
	on:pointerenter={() => (hovered = true)}
	on:pointerleave={() => (hovered = false)}
	on:click={() => (opened ? close() : open())}
	bind:this={iconContainer}
	class="active:brightness-50"
>
	<Info />
</button>

{#if (hovered && !clickable) || opened}
	<AttachToElement to={iconContainer} offsetY={40} centerX bind:recalcHelper>
		<span class="!font-normal text-left normal-case">
			<InfoBubble gradientText={false} boldText={false} wedgePosition="center">
				<slot />

				<div class="flex justify-end mt-4">
					{#if showGotIt}
						<div>
							<PrimaryButton on:click={() => (opened = false)}>Got it</PrimaryButton>
						</div>
					{/if}
				</div>
			</InfoBubble>
		</span>
	</AttachToElement>
{/if}
