<script lang="ts">
	export let placeholder: string = '';
	export let value: string;
	export let iconUrl: string;
	export let pattern = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?';
	export let valid: boolean = true;

	$: valid = !value || (!!value && !!value.match(pattern));

	$: console.log(valid);
</script>

<div class="flex space-x-2">
	<img class="rounded-full w-10 h-10 p-2  border border-[#1A1A1A]" src={iconUrl} alt="" />
	<input type="text" class="input input-gray-outline w-full" {placeholder} {pattern} bind:value />
</div>
