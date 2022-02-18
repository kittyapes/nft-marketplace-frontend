export function outsideClickCallback(node: HTMLElement, { cb }: { cb: () => any }) {
	document.addEventListener(
		'click',
		(event) => {
			const composedPath = event.composedPath();

			if (!composedPath.includes(node)) {
				cb();
			}
		},
		true
	);
}
