export function regexFilter(node: HTMLInputElement, options: { regex: RegExp }) {
	node.addEventListener('keypress', (ev) => {
		const original = node.value;

		node.addEventListener(
			'input',
			(ev) => {
				if (!node.value.match(options.regex)) {
					ev.stopImmediatePropagation();
					window.requestAnimationFrame(() => (node.value = original));
				}
			},
			{ once: true }
		);
	});
}
