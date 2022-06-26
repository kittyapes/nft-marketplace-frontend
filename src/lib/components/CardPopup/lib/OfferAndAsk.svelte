<script lang="ts">
	export let offer: string = 'N/A';
	export let ask: string = 'N/A';
</script>

<div class="flex border-t border-gray-400">
	<div class="w-1/2 p-2 font-medium border-r border-gray-400">
		<div class="text-sm font-medium opacity-50">Current highest offer</div>
		<div class="font-semibold">{offer}</div>
	</div>

	<div class="w-1/2 p-2">
		<div class="text-sm font-medium text-right opacity-50">Current ASK</div>
		<div class="font-semibold text-right">{ask}</div>
	</div>
</div>
