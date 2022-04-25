<script lang="ts">
	import ReportActive from '$icons/report-active.svelte';
	import Report from '$icons/report.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let active = false;
	let handleReport = () => {
		active = true;
		console.log(active);
	};
</script>

<ColumnComponentContainer class="justify-center">
	<div class="clickable">
		{#if props?.active || active}
			<ReportActive />
		{:else}
			<div on:click={handleReport}>
				<Report />
			</div>
		{/if}
	</div>
</ColumnComponentContainer>
