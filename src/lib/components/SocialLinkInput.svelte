<script lang="ts">
	export let placeholder: string = '';
	export let value: string;
	export let iconUrl: string;
</script>

<div class="flex space-x-2">
	<img class="rounded-full w-10 h-10 p-2  border border-[#1A1A1A]" src={iconUrl} alt="" />
	<input type="text" class="input input-gray-outline w-full" {placeholder} bind:value />
</div>
