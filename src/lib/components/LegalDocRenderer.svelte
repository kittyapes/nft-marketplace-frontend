<script lang="ts">
	import { browser } from '$app/env';
	import { tick } from 'svelte';

	export let jsonUrl: string;
	export let menuTitle: string;

	if (!jsonUrl) {
		throw new Error('jsonUrl is not defined');
	}

	if (!menuTitle) {
		throw new Error('menuTitle is not defined');
	}

	function titleToHash(title: string, omitHash: boolean = false): string {
		return (omitHash ? '' : '#') + title.toLowerCase().replace(/\s/g, '-').replace(/\?/g, '');
	}

	let currentHash = browser && window.location.hash;

	function updateHash(event, hash: string) {
		event?.preventDefault();
		currentHash = hash;
		window.location.hash = hash;
	}

	let scrollY;
	let titles: HTMLElement[] = [];

	let blockSectionRefreshFromScroll = false;

	function refreshSectionHighlight(_) {
		if (!titles.length || blockSectionRefreshFromScroll) {
			return;
		}

		let visibleTitleIndex = 0;

		for (const [index, title] of titles.entries()) {
			const rect = title.getBoundingClientRect();

			if (rect.top < 0) {
				visibleTitleIndex = index + 1;
			}
		}

		const visibleHash =
			titles[visibleTitleIndex] && titleToHash(titles[visibleTitleIndex].innerText);

		if (visibleHash) {
			currentHash = visibleHash;
		}
	}

	$: refreshSectionHighlight(scrollY);

	async function scrollToSection(sectionHash: string) {
		await tick();

		blockSectionRefreshFromScroll = true;

		setTimeout(() => {
			blockSectionRefreshFromScroll = false;
		}, 1000);

		if (currentHash) {
			const target = document.querySelector(currentHash + '-section-title');

			if (target) {
				target.scrollIntoView();
			}
		}
	}
</script>

<svelte:window bind:scrollY />

{#await fetch(jsonUrl).then((res) => res.json())}
	Loading document...
{:then doc}
	<div id="menu-container">
		<h1>{menuTitle}</h1>

		<ul id="section-links-container">
			{#each doc.terms as section}
				<li class="section-link" class:highlight={currentHash === titleToHash(section.title)}>
					<a
						href={titleToHash(section.title)}
						on:click={(ev) => updateHash(ev, titleToHash(section.title))}
					>
						{section.title}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="max-w-4xl mx-auto p-4 ml-[30rem] mt-40 mb-32">
		{#each doc.terms as section, index}
			<h2
				id="{titleToHash(section.title, true)}-section-title"
				class="section-title"
				bind:this={titles[index]}
			>
				{section.title}
			</h2>

			<div class="contents section-markup">
				{@html section.markup}
			</div>
		{/each}
	</div>

	{scrollToSection(currentHash)}
{:catch}
	Error loading document.
{/await}

<style>
	.section-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	/* Menu Title */
	h1 {
		@apply text-xl font-bold;
	}

	h1::after {
		@apply mt-8 w-full block;
		content: '';
		height: 1px;
		background-color: #0c1011;
		opacity: 0.8;
	}

	.section-title {
		@apply font-semibold text-3xl mt-24 mb-12 first:mt-0;
	}

	.section-title::after {
		@apply mt-6 w-full block;
		content: '';
		height: 2px;
		background-color: #0c1011;
		opacity: 0.8;
	}

	.section-markup {
		@apply leading-9;
	}

	#menu-container {
		@apply fixed m-16 max-w-xs;
	}

	#section-links-container {
		@apply grid gap-y-4 mt-8;
	}

	/* Section link */
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
</style>
