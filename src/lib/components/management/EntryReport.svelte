<script lang="ts">
	import ReportActive from '$icons/report-active.svelte';
	import Report from '$icons/report.svelte';
	import ColumnComponentContainer from './ColumnComponentContainer.svelte';

	export let props;

	let handleReport = () => {
		props.active = true;
	};
</script>

<ColumnComponentContainer class="btn">
	{#if props.active}
		<ReportActive />
	{:else}
		<div on:click={handleReport}>
			<Report />
		</div>
	{/if}
</ColumnComponentContainer>
