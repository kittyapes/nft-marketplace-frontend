<script lang="ts">
	import { browser } from '$app/environment';
	import DropdownArrow from '$icons/dropdown-arrow.svelte';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';

	export let jsonUrl: string;
	export let menuTitle: string;

	if (!jsonUrl) {
		throw new Error('jsonUrl is not defined');
	}

	if (!menuTitle) {
		throw new Error('menuTitle is not defined');
	}

	function titleToHash(title: string, omitHash: boolean = false): string {
		return (omitHash ? '' : '#') + title?.toLowerCase().replace(/\s/g, '-').replace(/\?/g, '');
	}

	let currentHash = browser && window.location.hash;

	// Used when the user clicks on a section link
	function updateHash(event, hash: string) {
		event?.preventDefault();
		currentHash = hash;
		window.location.hash = hash;
	}

	// Updating the highlighted section when the user scrolls
	let scrollY: number;
	let titles: HTMLElement[] = [];

	let blockSectionRefreshFromScroll = false;

	function refreshSectionHighlight(_) {
		if (!titles.length || blockSectionRefreshFromScroll) {
			return;
		}

		let visibleTitleIndex = 0;

		for (const [index, title] of titles.entries()) {
			const rect = title.getBoundingClientRect();

			if (rect.top < window.innerHeight / 2) {
				visibleTitleIndex = index;
			}
		}

		const visibleHash =
			(titles[visibleTitleIndex] && titleToHash(titles[visibleTitleIndex].querySelector('div').querySelector('span')?.innerText)) || titleToHash(titles[visibleTitleIndex]?.innerText);

		if (visibleHash) {
			currentHash = visibleHash;
		}
	}

	$: refreshSectionHighlight(scrollY);

	// Scroll to a section without interfering with the scroll handler
	async function scrollToSection(sectionHash: string) {
		if (!sectionHash) {
			return;
		}

		await tick();

		blockSectionRefreshFromScroll = true;

		setTimeout(() => {
			blockSectionRefreshFromScroll = false;
		}, 1000);

		const target = document.querySelector(sectionHash + '-section-title');
		if (target) {
			target.scrollIntoView({ block: 'center' });
		}
	}

	let menuHeight = 0;
	$: translateMenuPx = browser ? Math.min(0, document.body.clientHeight - menuHeight - scrollY - 600) : 0;
</script>

<svelte:window bind:scrollY />

{#await fetch(jsonUrl).then((res) => res.json())}
	<div class="font-semibold text-center py-32 text-lg">Loading document...</div>
{:then doc}
	<!-- Desktop Menu -->
	<div id="menu-container" class="hidden lg:block" style="--translate-px: {translateMenuPx}px" in:fade bind:clientHeight={menuHeight}>
		<h1>{menuTitle}</h1>

		<ul id="section-links-container">
			{#each doc.terms as section}
				<li class="section-link" class:highlight={currentHash === titleToHash(section.title)}>
					<a href={titleToHash(section.title)} on:click={(ev) => updateHash(ev, titleToHash(section.title))}>
						{section.title}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Mobile title -->
	<h1 class="px-8 mt-8 mb-8 font-semibold text-lg lg:hidden">{menuTitle}</h1>

	<div class="max-w-4xl mx-auto px-4 lg:px-0 lg:pr-16 lg:ml-[30rem] lg:mt-40 mb-32" in:fade>
		{#each doc.terms as section, index}
			<!-- Desktop title -->
			<h2 id="{titleToHash(section.title, true)}-section-title" class="section-title hidden lg:block" bind:this={titles[index]}>
				<div class="" class:text-center={section.center}>
					{#if section.numbered}
						{index}.&emsp;
						<span>{section.title}</span>
					{:else}
						{section.title}
					{/if}
				</div>
				{#if section.break}
					<div class=" mt-6 w-full h-[2px] bg-[#0c1011] opacity-80" />
				{/if}
			</h2>

			<!-- Mobile title and dropdown -->
			<input type="checkbox" id="{titleToHash(section.title, true)}-section-title-mobile" class="mobile-section" />
			<label for="{titleToHash(section.title, true)}-section-title-mobile" class="mobile-section lg:!hidden">
				{section.title}

				<div class="dropdown-arrow">
					<DropdownArrow />
				</div>
			</label>

			<!-- Mobile and Desktop content -->
			<div class="lg:contents section-markup px-8 lg:px-0">
				{@html section.markup}
			</div>
		{/each}
	</div>

	{scrollToSection(currentHash) && ''}
{:catch}
	Error loading document.
{/await}

<style lang="postcss">
	/* Mobile and Desktop content */
	.section-markup {
		@apply leading-9;
	}

	/* Desktop title */
	.section-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	/* Desktop Menu Title */
	#menu-container h1 {
		@apply text-xl font-bold;
	}

	#menu-container h1::after {
		@apply mt-8 w-full block;
		content: '';
		height: 1px;
		background-color: #0c1011;
		opacity: 0.8;
	}

	/* Desktop section title */
	.section-title {
		@apply font-semibold text-3xl mt-24 mb-12 first:mt-0;
	}

	.section-title::after {
	}

	/* Desktop menu container */
	#menu-container {
		@apply fixed m-16 max-w-xs overflow-y-auto scrollbar-hide;
		transform: translateY(var(--translate-px));
		max-height: calc(100vh - 8rem);
	}

	#section-links-container {
		@apply grid gap-y-4 mt-8;
	}

	/* Desktop Section link */
	.section-link {
		@apply font-semibold pl-12 relative;
	}

	.section-link::after {
		@apply grid place-items-center absolute left-0 top-0 opacity-0;
		@apply transition duration-300;
		content: url('/svg/selected-radio-button.svg');
	}

	.section-link::before {
		@apply grid place-items-center absolute left-0 top-0;
		content: url('/svg/radio-button.svg');
	}

	.section-link.highlight::after {
		@apply opacity-100;
	}

	/* Mobile section dropdown input */
	input.mobile-section {
		@apply hidden;
	}

	/* Mobile section label */
	label.mobile-section {
		@apply font-bold relative pl-8 text-lg opacity-60 my-4 flex items-center pr-8;
		color: #0c1011;
	}

	input.mobile-section:checked + label.mobile-section {
	}

	label.mobile-section::before {
		@apply grid place-items-center absolute left-0 top-0;
		content: url('/svg/radio-button.svg');
	}

	label.mobile-section::after {
		@apply grid place-items-center absolute left-0 top-0 opacity-0;
		content: url('/svg/selected-radio-button.svg');
	}

	input.mobile-section:checked + label.mobile-section::after {
		@apply opacity-100;
		@apply transition-opacity duration-300;
	}

	/* Mobile section markup */
	input.mobile-section + label + div.section-markup {
		@apply transition-opacity duration-300 opacity-0 h-0 overflow-hidden;
	}

	input.mobile-section:checked + label + div.section-markup {
		@apply opacity-100;
		height: max-content;
	}

	/* Mobile dropdown icon */
	label.mobile-section > .dropdown-arrow {
		@apply absolute right-0 top-2 bottom-0 grid place-items-center;
		@apply transition-transform duration-300;
	}

	input.mobile-section:checked + label > .dropdown-arrow {
		@apply rotate-180;
	}
</style>
