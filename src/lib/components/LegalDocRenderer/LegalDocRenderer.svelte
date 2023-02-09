<script lang="ts">
	import { browser } from '$app/environment';
	import DropdownArrow from '$icons/dropdown-arrow.svelte';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LegalDocData } from './LegalDocRenderer';

	export let loading = false;
	export let docData: LegalDocData;
	export let menuTitle: string;
	export let isContained: boolean = false;
	export let desktopMenuOffsetTop = 24;

	if (!menuTitle) {
		throw new Error('menuTitle is not defined');
	}

	let componentContainer: HTMLElement;

	function titleToHash(title: string, omitHash: boolean = false): string {
		return (omitHash ? '' : '#') + title?.toLowerCase().replace(/\s/g, '-').replace(/\?/g, '');
	}

	let currentHash = browser && window.location.hash;

	// Used when the user clicks on a section link
	function handleMenuSectionClick(event, hash: string) {
		event?.preventDefault();
		currentHash = hash;

		if (!isContained) {
			window.location.hash = hash;
		}
	}

	// Scroll handler
	function handleContainerScroll() {
		containerScrollY = componentContainer.scrollTop;
	}

	// Updating the highlighted section when the user scrolls
	let windowScrollY: number;
	let windowScrollX: number;
	let containerScrollY: number;
	let titles: HTMLElement[] = [];

	$: respectedScrollY = isContained ? containerScrollY : windowScrollY;

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

	$: refreshSectionHighlight(respectedScrollY);

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
</script>

<svelte:window bind:scrollY={windowScrollY} />

{#if loading}
	<div class="text-center py-32 text-lg text-white">Loading document...</div>
{:else if !loading && !docData?.length}
	<div class="text-center py-32 text-lg text-white">No data to display.</div>
{:else}
	<div
		on:scroll={handleContainerScroll}
		bind:this={componentContainer}
		class="h-full flex mx-auto max-w-screen-2xl text-white blue-scrollbar"
		class:overflow-y-auto={isContained}
		class:overflow-x-auto={isContained}
	>
		<!-- Desktop menu section -->
		<div id="menu-container" class="hidden lg:block" style="top: {desktopMenuOffsetTop / 4}rem" in:fade>
			<h1 class="uppercase">{menuTitle}</h1>

			<ul id="section-links-container">
				{#each docData as section}
					<li class="section-link" class:highlight={currentHash === titleToHash(section.title)}>
						<a href={titleToHash(section.title)} on:click={(ev) => handleMenuSectionClick(ev, titleToHash(section.title))}>
							{section.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Document section -->
		<div>
			<!-- Mobile doc title -->
			<h1 class="px-8 mt-24 mb-8 font-semibold text-lg lg:hidden">{menuTitle}</h1>

			<!-- Desktop doc title -->
			<h1 class="hidden lg:block text-center pr-16 lg:mt-40 font-semibold text-3xl mb-16">
				{menuTitle}
			</h1>

			<div class="max-w-4xl px-4 lg:px-0 lg:pr-16 mb-32" in:fade>
				{#each docData as section, index}
					<!-- Desktop section title -->
					<h2 id="{titleToHash(section.title, true)}-section-title" class="section-title hidden lg:block" bind:this={titles[index]}>
						<div>
							{index + 1}.&emsp;
							<span>{section.title}</span>
						</div>
					</h2>

					<!-- Mobile section title and dropdown -->
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
		</div>
	</div>

	{scrollToSection(currentHash) && ''}
{/if}

<style lang="postcss">
	/* Desktop Menu Title */
	#menu-container h1 {
		@apply text-xl font-bold;
	}

	#menu-container h1::after {
		@apply mt-8 w-full block bg-gray-400;
		content: '';
		height: 1px;
		opacity: 0.8;
	}

	/* Desktop section title */
	.section-title {
		@apply font-semibold text-3xl mt-12 mb-4 first:mt-0;
	}

	.section-title::after {
	}

	/* Desktop menu container */
	#menu-container {
		@apply sticky self-start m-16 max-w-xs scrollbar-hide;
	}

	#section-links-container {
		@apply grid gap-y-4 mt-8;
	}

	/* Desktop Section link */
	.section-link {
		@apply font-semibold pl-12 relative;
	}

	.section-link::after {
		@apply grid place-items-center absolute left-3 top-0 bottom-0 opacity-0;
		@apply transition duration-300;
		content: url('/svg/selected-radio-button.svg');
	}

	.section-link::before {
		@apply grid place-items-center absolute left-3 top-0 bottom-0;
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
		@apply font-bold relative pl-8 text-lg my-4 flex items-center pr-8 cursor-pointer select-none;
	}

	input.mobile-section:checked + label.mobile-section {
	}

	label.mobile-section::before {
		@apply grid place-items-center absolute left-0 top-0 bottom-0;
		content: url('/svg/radio-button.svg');
	}

	label.mobile-section::after {
		@apply grid place-items-center absolute left-0 top-0 bottom-0 opacity-0;
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
