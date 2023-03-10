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
	export let gradientCaret = false;
	export let inputMode:
		| 'text'
		| 'none'
		| 'tel'
		| 'url'
		| 'email'
		| 'numeric'
		| 'decimal'
		| 'search' = 'text';

	function validate() {
		if (regex) {
			valid = !!value.match(regex);
		} else {
			valid = validator(value);
		}
	}

	$: inputHeight = `h-[${height}]`;
</script>

<div
	class="w-full flex flex-row items-center outline-color-purple {$$props.class} {fixedHeight
		? inputHeight
		: ''}"
	class:outline-red-400={!valid}
	style={$$props.style}
	on:click
>
	<div class="bg-inherit  h-full grid place-items-center"><slot /></div>
	<input
		type="text"
		inputmode={inputMode}
		{pattern}
		bind:value
		{placeholder}
		class:pl-0={noLeftPadding}
		class:caret-color-purple={gradientCaret}
		class="w-full h-full px-4 bg-inherit outline-none focus:border-color-purle"
		on:input={validate}
		{disabled}
		on:keyup
		on:focus
		on:blur
	/>
	<div class="bg-inherit h-full grid place-items-center">
		<slot name="end-icon" />
	</div>
</div>
