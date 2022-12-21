<script lang="ts">
	import type { PopupHandler } from '$utils/popup';
	import ActionSuccessPopup from './ActionSuccessPopup.svelte';

	export let handler: PopupHandler;
	export let label: string;
</script>

<ActionSuccessPopup {handler}>
	<div slot="title">Successfully discarded a Terms of Service document draft.</div>
	<div slot="content">
		A draft of a new Terms of Service document has been discarded. The version label of the discarded draft was <span class="bg-gray-100 py-px px-2 rounded">{label}</span>
		.
	</div>
</ActionSuccessPopup>
