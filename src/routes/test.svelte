<script lang="ts">
    import LimitedPopup from "$lib/components/marketplace/__LimitedCardPopup/index.svelte";
    import AuctionPopup from "$lib/components/marketplace/__AuctionCardPopup/index.svelte";
    import BidPopup from "$lib/components/marketplace/AuctionCardPopup/index.svelte";

    import { setPopup } from "$utils/popup";
    import { onMount } from "svelte";

    onMount(() => setPopup(BidPopup));
</script>