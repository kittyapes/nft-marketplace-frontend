<script lang="ts">
	export let values: [string, number][];
	export let expired: boolean = false;
</script>

<div class="flex justify-center gap-4 text-white">
	{#each values as [label, value]}
		<div>
			<div class="relative grid w-16 h-16 place-items-center border-white border-2">
				<div
					class="absolute w-full h-full bg-gradient-to-r from-color-purple to-color-blue opacity-10"
				/>
				<span class="text-2xl font-bold">
					{#if expired}
						0
					{:else}
						{value}
					{/if}
				</span>
			</div>

			<div class="mt-2 text-center">{label}</div>
		</div>
	{/each}
</div>
