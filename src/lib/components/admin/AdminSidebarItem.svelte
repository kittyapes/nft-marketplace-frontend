<script lang="ts">
	import AnalyticsIcon from '$icons/analytics.svelte';
	import UserManageIcon from '$icons/user-manage.svelte';
	import CreateIcon from '$icons/create.svelte';

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

			<button>
				<svg
					width="14"
					height="8"
					viewBox="0 0 14 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="-rotate-90"
				>
					<path
						d="M2.49922 0.400391L6.99922 4.90039L11.4992 0.400391L13.2992 1.30039L6.99922 7.60039L0.699219 1.30039L2.49922 0.400391Z"
						fill="#585858"
					/>
				</svg>
			</button>
		</div>
	</a>
</div>
