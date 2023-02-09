<script lang="ts">
	import ThemedCross from '$icons/themed-cross.svelte';
	import type { UserNotification } from '$utils/api/notifications';

	export let notification: UserNotification;
	export let wrapperClass = '';
</script>

<section class="w-full flex items-center overflow-x-hidden px-20 relative wrapper {wrapperClass}">
	<div class="w-[200%] h-full absolute moving-bar-primary flex items-center overflow-x-hidden">
		<div class="w-[25%] flex items-center justify-center min-w-[25%]">
			<h1 class="text-xl whitespace-nowrap">{notification?.content}</h1>
		</div>

		<div class="w-[25%] min-w-[25%] h-full" />

		<div class="w-[25%] flex items-center justify-center min-w-[25%]">
			<h1 class="text-xl whitespace-nowrap">{notification?.content}</h1>
		</div>

		<div class="w-[25%] min-w-[25%] h-full" />

		<div class="w-[25%] flex items-center justify-center min-w-[25%]">
			<h1 class="text-xl whitespace-nowrap">{notification?.content}</h1>
		</div>

		<div class="w-[25%] min-w-[25%] h-full" />

		<div class="w-[25%] flex items-center justify-center min-w-[25%]">
			<h1 class="text-xl whitespace-nowrap">{notification?.content}</h1>
		</div>

		<div class="w-[25%] min-w-[25%] h-full" />
	</div>

	<div class="clickable absolute right-4 bg-dark-gradient" on:click>
		<ThemedCross class="w-12 h-12 " />
	</div>
</section>

<style type="postcss">
	.wrapper {
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(180deg, rgba(136, 234, 255, 0.2) 0%, rgba(133, 141, 247, 0.112) 100%, rgba(133, 141, 247, 0.2) 100%),
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.15) 0%, rgba(142, 119, 247, 0.15) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.15) 0%, rgba(142, 119, 247, 0.15) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.15) 0%, rgba(142, 119, 247, 0.15) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
	}

	.moving-bar-primary {
		animation: primary 10s linear infinite;
	}

	@keyframes primary {
		0% {
			left: 0%;
		}
		100% {
			left: -100%;
		}
	}
</style>
