<!-- 
	@component

	The `PrimaryButton` component consists of border stroke (`strokeBackground`),
	inner background and inner overlay parts.

	The variants of this button are `default` (the blue/purple one), `red`, and `green`.

	Other variants can be added in the `PrimaryButton.ts` file.

	Style of the parts listed above can also be set individually. These individually
	set styles have higher priority than those selected by setting the `variant` property.

	**Behavior:**

	When the button is hovered, the inner background and overlay will disabled.
	Only the border background will be left in place.
	
	**Properties:**
	 - `disabled`
	 - `selected` - forces rendering of the button as if it was hovered
	 - `variant` - `default` (blue/purple), `red`, `green`
	 - `options` - a `PrimaryButtonOptions` object.
	Has the following styling properties: `strokeBackground`, `innerOverlayBackground`,
	`innerOverlayBoxShadow`, `innerBackground`. All these are CSS property values. No need to include `background:` and a `;`.
	 - `extButtonClass` - Classes to be attached to the outer most container, being the button itself.
 -->
<script lang="ts">
	import { buttonBaseClasses } from '../ButtonBase/buttonBase';
	import {
		primaryButtonVariants,
		type PrimaryButtonOptions,
		type PrimaryButtonVariant,
	} from './PrimaryButton';

	export let disabled = false;
	export let selected = false;
	export let variant: PrimaryButtonVariant = 'default';
	export let options: Partial<PrimaryButtonOptions> = {};
	export let extButtonClass = '';

	$: _options = {
		...primaryButtonVariants['default'],
		...primaryButtonVariants[variant],
		...options,
	};
</script>

<button
	class="text-white h-12 flex-shrink-0 p-[2px] outer-shadow group outline-none relative block whitespace-nowrap {buttonBaseClasses} {extButtonClass}"
	style="background: {_options.strokeBackground};"
	data-perma-hover={selected}
	{disabled}
	on:click
>
	<div
		class="group-focus-visible:bg-transparent h-full"
		style="background: {_options.innerBackground}"
	>
		<div
			class="flex items-center justify-center inner-shadow px-6 h-full"
			style="background: {_options.innerOverlayBackground}; box-shadow: {_options.innerOverlayBoxShadow};"
		>
			<slot />
		</div>
	</div>
</button>

<style lang="postcss">
	button:not(:disabled) > div:hover,
	button[data-perma-hover='true'] > div {
		@apply !bg-transparent;
	}
</style>
