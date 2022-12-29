<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let height: string = '3rem';
	export let fixedHeight = true;
	export let pattern = '';
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

	$: inputHeight = `h-[${height}]`;
</script>

<div class="w-full flex flex-row items-center rounded-lg  outline-color-purple {$$props.class} {fixedHeight ? inputHeight : ''}" class:outline-red-400={!valid}>
	<div><slot /></div>
	<input
		type="text"
		{pattern}
		bind:value
		{placeholder}
		class:pl-0={noLeftPadding}
		class="w-full h-full px-14 bg-inherit outline-none focus:border-color-purle"
		on:input={validate}
		{disabled}
		on:keyup
		on:focus
		on:blur
	/>
	<div>
		<slot name="end-icon" />
	</div>
</div>
