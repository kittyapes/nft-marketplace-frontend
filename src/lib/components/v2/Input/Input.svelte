<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let height: string = '3rem';
	export let regex: RegExp = null;
	export let valid = true;
	export let validator: (v: string) => boolean = (): boolean => true;
	export let disabled = false;
	export let noLeftPadding = false;
	function validate() {
		if (regex) {
			valid = !!value.match(regex);
		} else {
			valid = validator(value);
		}
	}
</script>

<div class="w-full flex flex-row items-center rounded-lg  outline-color-purple {$$props.class}" class:outline-red-400={!valid} style:height>
	<div><slot /></div>
	<input type="text" bind:value {placeholder} class:pl-0={noLeftPadding} class="w-full h-full px-4 bg-inherit outline-none" on:input={validate} {disabled} />
</div>
