<script lang="ts">
	import type { PopupHandler } from '$utils/popup';
	import ActionSuccessPopup from './ActionSuccessPopup.svelte';

	export let handler: PopupHandler;
	export let label: string;
</script>

<ActionSuccessPopup {handler}>
	<div slot="title">Successfully published a Terms of Service document version.</div>
	<div slot="content">
		A draft of a new Terms of Service document has been published. The version label of the published draft is <span class="bg-gray-800 py-px px-2 rounded">{label}</span>
		. All users will now be required to accept this new version.
	</div>
</ActionSuccessPopup>
