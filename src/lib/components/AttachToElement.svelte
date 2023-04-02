<script lang="ts">
	import { browser } from '$app/environment';

	export let to: HTMLElement;
	export let right = false;
	export let bottom = false;
	export let offsetX = 0;
	export let offsetY = 0;
	export let recalcHelper = 0;

	export function recalc() {
		recalcHelper++;
	}

	function getCoords(elem: HTMLElement) {
		let box = elem.getBoundingClientRect();

		return {
			top: box.top,
			right: box.right,
			bottom: box.bottom,
			left: box.left,
			height: box.height,
			width: box.width,
		};
	}

	let clientRect: {
		top: number;
		right: number;
		bottom: number;
		left: number;
		height: number;
		width: number;
	};

	$: {
		recalcHelper;
		clientRect = browser && to && getCoords(to);
	}
</script>

<div
	class="fixed z-10"
	style="
    top: {clientRect?.top + (bottom ? clientRect?.height : 0) + offsetY}px;
    left: {clientRect?.left + (right ? clientRect?.width : 0) + offsetX}px"
>
	<slot />
</div>
