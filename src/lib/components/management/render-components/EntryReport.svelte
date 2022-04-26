<script lang="ts">
	import ReportActive from '$icons/report-active.svelte';
	import Report from '$icons/report.svelte';
	import { notifyError } from '$utils/toast';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let active = props?.active;
	let handleReport = () => {
		active = true;
		notifyError('User Reported');
	};
</script>

<ColumnComponentContainer class="justify-center">
	<div class="clickable">
		{#if active}
			<ReportActive />
		{:else}
			<div on:click={handleReport}>
				<Report />
			</div>
		{/if}
	</div>
</ColumnComponentContainer>
