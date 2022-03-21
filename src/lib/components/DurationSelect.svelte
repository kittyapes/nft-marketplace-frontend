<!-- This is not a finalized version, we are missing designs for the popup -->
<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import Clock from '$icons/clock.svelte';

	export let id = '';
	export let placeholder = 'HH:MM';
	export let seconds = 0;

	let open = false;

	let hours = 6;
	let minutes = 30;
	let inputText = '';

	let inputElement: HTMLInputElement;

	function clickDone() {
		inputElement.blur();
		open = false;
	}

	// prettier-ignore
	$: inputText = `${((hours || 0).toString()).padStart(2, '0')}:${((minutes || 0).toString()).padStart(2, '0')}`;
	$: seconds = (hours || 0) * 60 * 60 + (minutes || 0) * 60;
</script>

<div class="relative">
	<input
		{id}
		type="text"
		class="input w-full h-12 cursor-default disabled:bg-white"
		{placeholder}
		class:font-semibold={inputText}
		bind:value={inputText}
		bind:this={inputElement}
		disabled
	/>

	<button
		class="bg-color-black text-white w-20 absolute top-0 right-0 h-full rounded-r-md"
		on:click={() => (open = !open)}
	>
		<div class="btn flex items-center justify-center space-x-2">
			<Clock />
			<ArrowDown />
		</div>
	</button>

	{#if open}
		<div
			class="absolute top-0 right-0 w-full bg-white flex flex-col rounded-xl translate-y-14 p-4 z-10 h-[400px]"
			style="box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.16);"
		>
			<!-- Duration -->
			<div
				class="bg-color-black border rounded-xl h-12 text-white grid place-items-center uppercase w-2/3 mx-auto"
			>
				Duration
			</div>

			<!-- Input boxes -->
			<div class="flex items-center justify-center space-x-2 mt-4 flex-grow">
				<input
					type="number"
					min="0"
					class="input-hide-controls grid place-items-center border w-24 h-24 text-3xl text-center"
					bind:value={hours}
				/>

				<div class="text-6xl opacity-40 font-semibold">:</div>

				<input
					class="grid place-items-center border w-24 h-24 text-3xl text-center"
					bind:value={minutes}
				/>
			</div>

			<button class="btn btn-rounded mt-4 btn-black uppercase" on:click={clickDone}>Done</button>
		</div>
	{/if}
</div>

<style>
	input[type='range'] {
		-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
		width: 100%; /* Specific width is required for Firefox. */
		background: transparent; /* Otherwise white in Chrome */
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
	}

	input[type='range']:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	/* Special styling for WebKit/Blink */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 16px;
		width: 16px;
		border-radius: 999px;
		background: #388dfc;
		cursor: pointer;
		margin-top: -7px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
	}

	/* All the same stuff for Firefox */
	input[type='range']::-moz-range-thumb {
		box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
		border: 1px solid #000000;
		height: 36px;
		width: 16px;
		border-radius: 3px;
		background: #ffffff;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 2px;
		cursor: pointer;
		background: rgba(29, 29, 29, 0.3);
	}
</style>
