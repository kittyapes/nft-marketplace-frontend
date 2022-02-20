<script lang='ts'>
    import {  setPopup } from "$utils/popup";
    import PopupContainer from "../UniversalPopup/PopupContainer.svelte";
    import SuccessScreen from "../UniversalPopup/SuccessScreen.svelte";
    import QueuePopup from "$lib/components/marketplace/QueueCardPopup/index.svelte";
</script>

<PopupContainer size={'small'}>
    <SuccessScreen slot='content' successMessage={'You have met the requirements and have entered!'}>
        <p slot='continue-button' class='text-color-black underline underline-offset-1 text-xs font-bold cursor-pointer' on:click={() => setPopup(QueuePopup, {props: {queueEntry: true}})}>
            CONTINUE BROWSING
        </p>
    </SuccessScreen>
</PopupContainer>