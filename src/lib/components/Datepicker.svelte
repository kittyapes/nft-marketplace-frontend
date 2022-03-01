<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import Calendar from '$icons/calendar.svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import Time from '$icons/time.svelte';
	import dayjs from 'dayjs';
	import isoWeek from 'dayjs/plugin/isoWeek.js';
	import { onMount } from 'svelte';
	import Toggle from './Toggle.svelte';

	dayjs.extend(isoWeek);

	export let id = '';
	export let placeholder = 'Select date & time';

	let open = false;
	let section: 'date' | 'time' = 'date';

	const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	let selectedDate: dayjs.Dayjs = dayjs();

	function resetToday() {
		selectedDate = dayjs();
	}

	function nextMonth() {
		selectedDate = selectedDate.add(1, 'month');
	}

	function previousMonth() {
		selectedDate = selectedDate.subtract(1, 'month');
	}

	function handleDone() {
		selectedDate = selectedDate.hour(hours).minute(minutes);

		if (isPm) {
			selectedDate = selectedDate.add(12, 'hour');
		}

		inputText = selectedDate.format('YYYY-MM-DD h:mm A');
		open = false;
	}

	onMount(resetToday);

	let hours = 6;
	let minutes = 30;
	let monthDays = [];
	let inputText = '';
	let isPm = false;

	$: monthWeekdayOffset = selectedDate.date(1).isoWeekday() - 1;

	interface DayInTable {
		day: number;
		isSelected: boolean;
		isToday: boolean;
		isDisabled: boolean;
	}

	$: {
		const fillBeforeDays = Array(monthWeekdayOffset)
			.fill(0)
			.map((_, i) => ({
				day: selectedDate.subtract(1, 'month').daysInMonth() - monthWeekdayOffset + i + 1,
				isDisabled: true
			}));

		const currentMonthDays = Array(selectedDate.daysInMonth())
			.fill(0)
			.map((_, i) => ({ day: i + 1 }));

		const fillAfterDays = Array(42 - fillBeforeDays.length - currentMonthDays.length)
			.fill(0)
			.map((_, i) => ({ day: i + 1, isDisabled: true }));

		monthDays = [...fillBeforeDays, ...currentMonthDays, ...fillAfterDays] as DayInTable[];
	}
</script>

<div class="relative">
	<input
		{id}
		type="text"
		class="input w-full h-12"
		{placeholder}
		class:font-semibold={inputText}
		bind:value={inputText}
		readonly
	/>

	<button
		class="bg-color-black text-white w-20 absolute top-0 right-0 h-full rounded-r-md"
		on:click={() => (open = !open)}
	>
		<div class="btn flex items-center justify-center space-x-2">
			<Calendar />
			<ArrowDown />
		</div>
	</button>

	{#if open}
		<div
			class="absolute top-0 right-0 w-full bg-white flex flex-col rounded-xl translate-y-14 p-4 z-10"
			style="box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.16);"
		>
			<!-- use:outsideClickCallback={{ cb: () => (open = false) }} -->
			<!-- Date/Time switch -->
			<div
				class="border-color-black border rounded-xl h-12 grid grid-cols-2 overflow-hidden flex-shrink-0"
			>
				<button
					class="uppercase font-semibold transition flex items-center justify-center
                    {section === 'date' ? 'bg-black text-white' : ''}"
					on:click={() => (section = 'date')}
				>
					<Calendar />
					<span class="ml-2">Date</span>
				</button>

				<button
					class="uppercase font-semibold transition flex items-center justify-center
                    {section === 'time' ? 'bg-black text-white' : ''}"
					on:click={() => (section = 'time')}
				>
					<Time />
					<span class="ml-2">Time</span>
				</button>
			</div>

			{#if section === 'date'}
				<div class="flex mt-4">
					<div class="flex-grow font-bold">
						{selectedDate.format('MMM')}
						{selectedDate.year()}
					</div>
					<div class="flex space-x-2">
						<button class="btn" on:click={previousMonth}><ChevronLeft /></button>
						<button class="btn" on:click={nextMonth}><ChevronRight /></button>
					</div>
				</div>

				<div class="flex font-semibold mt-6">
					{#each days as day}
						<div class="flex-grow text-center">{day}</div>
					{/each}
				</div>

				<div class="grid grid-cols-7 gap-px bg-[#DFDFDF] border mt-3">
					{#each monthDays as day}
						<button
							class="btn flex-grow text-center aspect-1 bg-white grid place-items-center text-sm font-medium
							{day.day === selectedDate.date() ? 'bg-[#388DFC] text-white' : ''}
							{day.isDisabled ? 'text-[#747474] bg-[#FCFCFC]' : ''}"
							class:font-bold={day.isToday}
							on:click={() => (selectedDate = selectedDate.date(day.day))}
							disabled={day.isDisabled}
						>
							{day.day}
						</button>
					{/each}
				</div>

				<button class="btn btn-outline btn-rounded mt-4" on:click={() => (section = 'time')}>
					Select Time
				</button>
			{/if}

			{#if section === 'time'}
				<div class="flex justify-center mt-8">
					<Toggle onInsideLabel="PM" offInsideLabel="AM" bind:state={isPm} />
				</div>

				<div class="flex items-center justify-center space-x-2 mt-4">
					<div class="grid place-items-center border w-24 h-24 text-3xl">
						{hours}
					</div>

					<div class="text-6xl opacity-40 font-semibold">:</div>

					<div class="grid place-items-center border w-24 h-24 text-3xl">
						{minutes}
					</div>
				</div>

				<div class="mt-8">
					<label class="font-semibold">
						<div>Hours:</div>
						<input type="range" bind:value={hours} max="12" class="mt-2" />
					</label>

					<label class="font-semibold">
						<div>Minutes:</div>
						<input type="range" bind:value={minutes} max="60" class="mt-2" />
					</label>
				</div>

				<div class="flex-grow" />

				<button class="btn btn-rounded mt-4 btn-black uppercase" on:click={handleDone}>Done</button>
			{/if}
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
