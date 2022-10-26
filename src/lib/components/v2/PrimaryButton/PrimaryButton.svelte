<script lang="ts">
	import { buttonBaseClasses } from '../ButtonBase/buttonBase';

	export let disabled: boolean = false;
</script>

<button class="uppercase text-white {buttonBaseClasses} {$$props.class}" {disabled} on:click>
	<slot />
</button>
