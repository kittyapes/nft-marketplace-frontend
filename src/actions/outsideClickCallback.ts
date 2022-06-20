export function outsideClickCallback(node: HTMLElement, { cb }: { cb: (event?) => any }) {
	document.addEventListener(
		'click',
		(event) => {
			const composedPath = event.composedPath();

			if (!composedPath.includes(node)) {
				cb(event);
			}
		},
		true
	);
}
