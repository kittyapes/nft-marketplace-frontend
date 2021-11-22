<script>
	import QueueDrop from '$lib/components/drops/QueueDrop.svelte';
	import AuctionDrop from '$lib/components/drops/AuctionDrop.svelte';
	import LimitedDrop from '$lib/components/drops/LimitedDrop.svelte';
	import RandomDrop from '$lib/components/drops/RandomDrop.svelte';
	import SeriesDrop from '$lib/components/drops/SeriesDrop.svelte';
</script>

<div class="w-full">
	<SeriesDrop
		name="waifu series 15"
		description="The next batch of NFTs will include four original animated artworks available to DAO members only."
		timeLeft="5H 6M 22S"
	/>

	<RandomDrop name="Gacha" series="Metagen Mechas" generation="1" copiesAvailable="500" />
	<div class="w-full h-1 border-b-2" />

	<QueueDrop
		name="The Gatekeeper"
		image="https://hinatawaifu.mypinata.cloud/ipfs/QmcE7yeyCnaMr4dQwXE8kELnUGBqhN1ALDvynhZYRnBwbC/12.gif"
		requirements="500"
		inQueue="11400"
		currentPosition="402"
		price="500"
	/>
	<div class="w-full h-1 border-b-2" />

	<AuctionDrop
		name="The Builder"
		topBidAvatar="https://images.generated.photos/5Lc44DqxkR5Mhtm9SaQZgi8KBe6f0Lga7HkJAN54sGI/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92Ml8w/NTc4MDI3LmpwZw.jpg"
		topBidUsername="WAIFULover69"
		image="https://databasewaifu.herokuapp.com/images/15"
		timeLeft="1DAY 16H 4M 33S"
		initialPrice="2.1"
	/>
	<div class="w-full h-1 border-b-2" />

	<LimitedDrop
		name="The Pirate"
		image="https://hinatawaifu.mypinata.cloud/ipfs/QmcE7yeyCnaMr4dQwXE8kELnUGBqhN1ALDvynhZYRnBwbC/7.gif"
		creatorAvatar="https://images.generated.photos/5Lc44DqxkR5Mhtm9SaQZgi8KBe6f0Lga7HkJAN54sGI/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92Ml8w/NTc4MDI3LmpwZw.jpg"
		creatorUsername="WAIFULover69"
		copiesAvailable="7"
		price="350"
		timeLeft="1DAY 16H 4M 33S"
	/>
</div>
