import type { Writable } from 'svelte/store';

export function onHover(node: HTMLElement, hoverStore: Writable<boolean>) {
	function handleMouseOver() {
		hoverStore.set(true);
	}

	function handleMouseOut(event) {
		if (!node.contains(event.relatedTarget)) {
			hoverStore.set(false);
		}
	}

	node.addEventListener('mouseover', handleMouseOver);
	node.addEventListener('mouseout', handleMouseOut);

	return {
		destroy() {
			node.removeEventListener('mouseover', handleMouseOver);
			node.removeEventListener('mouseout', handleMouseOut);
		},
	};
}
