export function outsideClickCallback(node: HTMLElement, { cb }: { cb: () => any }) {
	document.addEventListener(
		'click',
		(event) => {
			if (event.target !== node) {
				cb();
			}
		},
		true
	);
}
