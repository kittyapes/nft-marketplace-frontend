export const ethAmountRegex = /^(0|[1-9]\d{0,17})(\.(\d{1,18})?)?$/gm;

export function regexFilter(node: HTMLInputElement, options: { regex: RegExp }) {
	node.addEventListener('keypress', (ev) => {
		// @ts-ignore
		const newValue = ev.target.value + ev.key;

		if (!newValue.match(options.regex)) {
			ev.preventDefault();
		}
	});
}
