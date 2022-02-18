export function outsideClickCallback(node: HTMLElement, { cb }: { cb: () => any }) {
	document.addEventListener(
		'click',
		(event) => {
			const composedPath = event.composedPath();

			// console.log(composedPath);

			if (!composedPath.includes(node)) {
				console.log('outside');
				cb();
			}
		},
		true
	);
}
