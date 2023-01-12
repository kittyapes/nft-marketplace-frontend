<script lang="ts">
	import InfoBubble from './InfoBubble.svelte';

	let hovering = false;

	function handlePointerEnter() {
		hovering = true;
	}

	function handlePointerLeave() {
		hovering = false;
	}
</script>

<div class="relative" on:pointerenter={handlePointerEnter} on:pointerleave={handlePointerLeave}>
	<div class="absolute top-[calc(100%+0.25rem)] h-full w-full z-10 transition pointer-events-none" class:opacity-0={!hovering} class:delay-500={hovering}>
		<InfoBubble>
			<slot name="bubble-content" />
		</InfoBubble>
	</div>

	<slot name="hoverable" />
</div>
