<script>
	export let bgColor = 'from-color-black to-color-black';
</script>

<button
	on:click
	class={`w-full rounded-full bg-gradient-to-r ${bgColor} text-xs uppercase flex items-center justify-center p-4 text-white ${$$props.class}`}
>
	<slot />
</button>
