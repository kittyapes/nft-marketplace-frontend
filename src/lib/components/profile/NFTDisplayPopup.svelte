<script lang="ts">
	import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';

	import InfoTab from '../marketplace/UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../marketplace/UniversalPopup/PopupContainer.svelte';

	export let options: UniversalPopupOptions;
</script>

<PopupContainer closeButton on:close {options}>
	<div slot="content" class="flex-grow flex flex-col">
		<InfoTab data={options} />
		{#if !options.currentUserIsOwner}
			<button class="btn btn-rounded btn-black uppercase text-sm font-normal mt-auto w-full mb-5 self-center">make an offer</button>
		{/if}
	</div>
</PopupContainer>
