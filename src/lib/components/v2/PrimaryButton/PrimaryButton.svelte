<script lang="ts">
	import { buttonBaseClasses } from '../ButtonBase/buttonBase';

	export let disabled: boolean = false;

	let isHovered = false;
</script>

<button
	class="uppercase text-white p-[2px] gradient-stroke-bg outer-shadow {buttonBaseClasses} {$$props.class}"
	{disabled}
	on:click
	on:mouseover={() => (isHovered = true)}
	on:focus={() => (isHovered = true)}
	on:mouseout={() => (isHovered = false)}
	on:blur={() => (isHovered = false)}
>
	<div class="bg-[#1d1832] hover:bg-transparent">
		<div class="h-12 flex items-center justify-center inner-shadow" class:gradient-bg={!isHovered}>
			<slot />
		</div>
	</div>
</button>

<style>
	.gradient-stroke-bg {
		background: linear-gradient(10deg, rgba(167, 148, 255, 0) 11.15%, rgba(167, 148, 255, 0.93) 57.47%, rgba(142, 119, 247, 0) 127.41%, rgba(142, 119, 247, 0) 127.41%, rgba(167, 148, 255, 0) 127.41%),
			linear-gradient(0deg, #67d4f8, #67d4f8);
	}

	.gradient-bg {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}

	.gradient-bg::before {
		background: #1d1832;
	}

	.inner-shadow {
		box-shadow: inset 0px 0px 17px rgba(120, 171, 248, 0.2);
	}
</style>
