const wedge = `
<svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.822 20.5695L15 21.7559L14.178 20.5695L3.7857 5.5695L2.69832 4H4.6077L25.3923 4H27.3017L26.2143 5.5695L15.822 20.5695Z" fill="white" stroke="#E0E0E0" stroke-width="2"/>
<line x1="1" y1="4" x2="29" y2="4" stroke="white" stroke-width="2"/>
</svg>
`;

function getHint(text: string) {
	return `
        <div class="relative flex justify-center">
            <div class="transition absolute"
                style="transform: translateY(calc(-100% + 6px)); opacity: var(--hint-opacity)">
                <div class="bg-white px-12 py-2 rounded-xl border-2 max-w-[600px] text-center whitespace-nowrap">
                    ${text}
                </div>

                <div class="w-full flex justify-center -translate-y-[7px]">
                    ${wedge}
                </div>
            </div>
        </div>
    `;
}

export function hoverHint(node: HTMLElement, options: { text: string; targetId: string }) {
	const { text } = options;

	const hintTarget = document.getElementById(options.targetId);
    if(!hintTarget) return;

	hintTarget.innerHTML = getHint(text);

	node.style.setProperty('--hint-opacity', '0');

	function setOpacity(opacity: number) {
		node.style.setProperty('--hint-opacity', opacity.toString());
	}

	node.addEventListener('mouseenter', () => setOpacity(1));
	node.addEventListener('mouseleave', () => setOpacity(0));
}
