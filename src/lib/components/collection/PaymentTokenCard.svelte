<script lang="ts">
	export let iconUrl: string;
	export let symbol: string;
	export let name: string;
</script>

<div class="border border-black flex flex-row rounded-md w-56 py-2 cursor-not-allowed">
	<div class="m-4 grid place-items-center">
		<img src={iconUrl} alt="{symbol} icon." />
	</div>

	<div class="">
		<div class="font-bold">{symbol}</div>
		<div>{name}</div>
	</div>
</div>
