export const fadeImageOnLoad = (node: HTMLElement) => {
	node.style.opacity = '0';
	node.style.transition = 'opacity 0.2s';

	node.addEventListener('load', () => (node.style.opacity = '1'));
};
