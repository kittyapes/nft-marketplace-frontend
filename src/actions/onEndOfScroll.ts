export function onEndOfScroll(node, callback) {
	function handleScroll() {
		const { scrollTop, scrollHeight, clientHeight } = node;
		if (scrollTop + clientHeight >= scrollHeight) {
			callback();
		}
	}

	node.addEventListener('scroll', handleScroll);

	return {
		destroy() {
			node.removeEventListener('scroll', handleScroll);
		},
	};
}
