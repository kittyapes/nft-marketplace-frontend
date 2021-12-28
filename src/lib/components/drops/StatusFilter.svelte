<script>
	import StatusFilterButton from '../marketplace/StatusFilterButton.svelte';
	import { DROP_STATUSES } from '$constants/marketplace';
</script>

<div class="flex flex-wrap gap-2">
	{#each DROP_STATUSES as st, i}
		<StatusFilterButton value={st.status} />
	{/each}
</div>
