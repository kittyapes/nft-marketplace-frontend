<script lang="ts">
    import LimitedPopup from "$lib/components/marketplace/LimitedCardPopup/index.svelte";
    import BidPopup from "$lib/components/marketplace/AuctionCardPopup/index.svelte";
    import RafflePopup from "$lib/components/marketplace/RaffleCardPopup/index.svelte";

    import { setPopup } from "$utils/popup";
    import { onMount } from "svelte";

    onMount(() => setPopup(RafflePopup));
</script>