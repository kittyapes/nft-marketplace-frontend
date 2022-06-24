<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let height: string = '3rem';
	export let regex: RegExp = null;
	export let valid = true;
	export let validator: (v: string) => boolean = (): boolean => true;
	export let disabled = false;

	function validate() {
		if (regex) {
			valid = !!value.match(regex);
		} else {
			valid = validator(value);
		}
	}
</script>

<input type="text" bind:value {placeholder} class="w-full px-4 border rounded-lg outline-color-purple {$$props.class}" class:outline-red-400={!valid} style:height on:input={validate} {disabled} />
