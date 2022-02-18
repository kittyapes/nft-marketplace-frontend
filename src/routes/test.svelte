<script lang="ts">
    import AuctionPopup from "$lib/components/marketplace/AuctionCardPopup/index.svelte";
    import { setPopup } from "$utils/popup";
    import { onMount } from "svelte";

    onMount(() => setPopup(AuctionPopup));
</script>