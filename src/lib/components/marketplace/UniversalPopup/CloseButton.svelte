<script lang="ts">
    import CloseButton from '$icons/close-button.svelte';
    import { closePopup } from '$utils/popup';
</script>

<button on:click={() => closePopup()} class='transition-btn'>
    <CloseButton />
</button>