<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let borderColor: string = 'black';
	export let height: string = '3rem';
	export let regex: RegExp = null;
	export let valid = true;

	function validate() {
		if (regex) {
			valid = !!value.match(regex);
		}
	}
</script>

<input
	type="text"
	bind:value
	{placeholder}
	class="w-full px-4 border rounded-lg outline-color-purple"
	class:outline-red-400={!valid}
	style:height
	style:border-color={borderColor}
	on:input={validate}
/>
