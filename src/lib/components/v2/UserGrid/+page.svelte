<script lang="ts">
	import UserCard from '$components/v2/UserCard/+page.svelte';
	export let users = [];
	export let isLoading = false;
</script>

<div class="w-full grid grid-cols-2 gap-x-0 gap-y-4 2xl:gap-y-5 text-white users">
	{#if users?.length > 0}
		{#each users as user}
			<UserCard bind:user />
		{/each}
	{:else if users?.length === 0 && !isLoading}
		<p class="p-36 whitespace-nowrap font-semibold text-lg opacity-70">Nothing to see here, move along.</p>
	{/if}
</div>
