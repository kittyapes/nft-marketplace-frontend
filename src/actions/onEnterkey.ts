export function onEnterKey(node: HTMLInputElement, callback: () => void) {
	node.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') {
			callback();
		}
	});
}
