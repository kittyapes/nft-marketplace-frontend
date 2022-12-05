<script lang="ts">
	import UserCard from './UserCard.svelte';
	export let users;
</script>

<div class="w-full grid grid-cols-2 gap-x-0 gap-y-4 2xl:gap-y-5 text-white users">
	{#each Array(25) as _}
		<UserCard />
	{/each}
</div>
