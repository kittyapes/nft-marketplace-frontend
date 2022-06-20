<script lang="ts">
	import { browser } from '$app/env';

	export let to: HTMLElement;
	export let right = false;
	export let bottom = false;
	export let offsetX = 0;
	export let offsetY = 0;

	function getCoords(elem) {
		let box = elem.getBoundingClientRect();

		return {
			top: box.top + window.pageYOffset,
			right: box.right + window.pageXOffset,
			bottom: box.bottom + window.pageYOffset,
			left: box.left + window.pageXOffset,
			height: box.height,
			width: box.width
		};
	}

	$: clientRect = browser && to && getCoords(to);
</script>

<div
	class="absolute"
	style="
    top: {clientRect?.top + (bottom ? clientRect?.height : 0) + offsetX}px;
    left: {clientRect?.left + (right ? clientRect?.width : 0) + offsetY}px"
>
	<slot />
</div>
