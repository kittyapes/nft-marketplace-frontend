<script lang="ts">
	import { browser } from '$app/env';

	export let to: HTMLElement;
	export let right = false;
	export let bottom = false;
	export let offsetX = 0;
	export let offsetY = 0;

	$: clientRect = browser && to?.getBoundingClientRect();
</script>

<div
	class="absolute"
	style="
    top: {clientRect?.top + (bottom ? clientRect?.height : 0) + offsetX}px;
    left: {clientRect?.left + (right ? clientRect?.width : 0) + offsetY}px"
>
	<slot />
</div>
