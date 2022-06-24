<script lang="ts">
	import { buttonBaseClasses } from '../ButtonBase/buttonBase';

	export let disabled: boolean = false;
</script>

<button class="bg-gradient-to-r from-color-purple to-color-blue uppercase text-white {buttonBaseClasses} {$$props.class}" {disabled} on:click>
	<slot />
</button>
