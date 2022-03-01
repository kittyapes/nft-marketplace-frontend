<script lang="ts">
	export let name: string;
	export let options: { label: string; value: string }[] = [];

	if (!options.length) {
		throw new Error('options is empty');
	}

	export let selected: string = options[0].value;

	function handleChange(event) {
		selected = event.target.value;
	}
</script>

<div class="flex gap-8">
	{#each options as option}
		<label class="whitespace-nowrap uppercase font-semibold flex cursor-pointer">
			<div
				class="border border-[#00000080] rounded-full p-1 w-6 h-6 {selected === option.value
					? '!border-[#388DFC]'
					: ''}"
			>
				<div class="w-full h-full rounded-full {selected === option.value ? 'bg-[#388DFC]' : ''}" />
			</div>

			<input type="radio" {name} value={option.value} on:change={handleChange} />
			<span class="ml-3">{option.label}</span>
		</label>
	{/each}
</div>

<style>
	input[type='radio'] {
		appearance: none;
	}
</style>
