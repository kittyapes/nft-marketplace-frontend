<script lang="ts">
	import AnalyticsIcon from '$icons/analytics.svelte';
	import UserManageIcon from '$icons/user-manage.svelte';
	import CreateIcon from '$icons/create.svelte';
	import FiltersIcon from '$icons/filters.svelte';
	import RightArrow from '$icons/right-arrow.svelte';

	export let title = '';
	export let href = '';
	export let icon = '';
	export let arrow = true;
</script>

<div>
	<a {href}>
		<div class="px-5 py-6 border-b border-gray-400 uppercase flex justify-between items-center">
			<div class=" w-full cursor-pointer flex items-center text-sm gap-4">
				{#if icon === 'create'}
					<CreateIcon />
				{:else if icon === 'users-manage'}
					<UserManageIcon />
				{:else if icon === 'analytics'}
					<AnalyticsIcon />
				{:else if icon === 'filters'}
					<FiltersIcon />
				{/if}

				{title}
			</div>

			{#if arrow}
				<button><RightArrow /></button>
			{/if}
		</div>
	</a>
</div>
