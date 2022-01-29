<script lang="ts">
	import AnalyticsIcon from '$icons/analytics.svelte';
	import UserManageIcon from '$icons/user-manage.svelte';
	import CreateIcon from '$icons/create.svelte';
	import RightArrowIcon from '$icons/RightArrow.svelte';

	export let title = '';
	export let href = '';
	export let icon = '';
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
				{/if}

				{title}
			</div>

			<button><RightArrowIcon /></button>
		</div>
	</a>
</div>
