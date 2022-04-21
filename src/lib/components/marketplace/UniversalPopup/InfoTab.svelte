<script lang="ts">
	import { fade } from 'svelte/transition';

	export let data: {
		creator?: string;
		edition?: string;
		editionType?: string;
		externalLink?: string;
		description?: string;
	};
</script>

<div in:fade={{ duration: 300 }}>
	<!-- Creator -->
	{#if data.creator}
		<div class="w-full flex gap-x-2 items-center">
			<span class="text-sm text-color-black opacity-70">Creator:</span>

			<img
				alt="face"
				class="w-6 h-6 rounded-full object-fill"
				src="https://images.generated.photos/5Lc44DqxkR5Mhtm9SaQZgi8KBe6f0Lga7HkJAN54sGI/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92Ml8w/NTc4MDI3LmpwZw.jpg"
			/>

			<span class="text-color-purple">@{data.creator}</span>
		</div>
	{/if}

	<!-- Edition -->
	{#if data.edition}
		<div class="w-full flex gap-x-2 items-center mt-5">
			<span class="text-sm text-color-black opacity-70">Edition:</span>

			<span class="font-semibold">{data.edition}</span>
		</div>
	{/if}

	<!-- External Link -->
	{#if data.externalLink}
		<div class="w-full flex gap-x-2 items-center mt-5">
			<span class="text-sm text-color-black opacity-70">External Link:</span>

			<span class="font-semibold">{data.externalLink}</span>
		</div>
	{/if}

	{#if data.editionType}
		<div class="w-full flex gap-x-2 items-center mt-5">
			<span class="text-sm text-color-black opacity-70">Edition Type:</span>

			<span class="font-semibold">{data.editionType}</span>
		</div>
	{/if}

	<!-- Description -->
	{#if data.description}
		<div class="w-full  flex flex-col gap-2 mt-5">
			<span class="text-sm text-color-black opacity-70">Description:</span>
			<span>
				{data.description}
			</span>
		</div>
	{/if}

	<slot name="additional-content" />
</div>
