<script>
	import StatusFilterButton from './StatusFilterButton.svelte';
	import { CARD_STATUSES } from '../../../ts/constants/marketplace';
</script>

<div class="flex flex-wrap gap-2">
	{#each CARD_STATUSES as st, i}
		<StatusFilterButton id={i}>{st.status}</StatusFilterButton>
	{/each}
</div>
