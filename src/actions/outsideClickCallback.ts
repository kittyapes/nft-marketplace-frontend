export function outsideClickCallback(node: HTMLElement, { cb, ignoredTargets }: { cb: (event?) => any; ignoredTargets?: HTMLElement[] }) {
	document.addEventListener(
		'click',
		(event) => {
			const composedPath = event.composedPath();

			// Ignore ignored targets :)
			for (const ignored of ignoredTargets || []) {
				if (composedPath.includes(ignored)) {
					return;
				}
			}

			if (!composedPath.includes(node)) {
				cb(event);
			}
		},
		true,
	);
}
