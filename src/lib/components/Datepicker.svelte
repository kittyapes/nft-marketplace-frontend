<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import Calendar from '$icons/calendar.svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import Time from '$icons/time.svelte';
	import { formatDatetimeFromISO } from '$utils/misc/formatDatetime';
	import dayjs, { Dayjs } from 'dayjs';
	import isoWeek from 'dayjs/plugin/isoWeek.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import Toggle from './Toggle.svelte';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';

	const dispatch = createEventDispatcher();

	dayjs.extend(isoWeek);

	export let id = '';
	export let placeholder = 'Select date & time';
	export let value = dayjs();
	export let dateOnly = false;
	export let allowPastSelection = false;
	export let disabled = false;

	export function setWithTimestamp(ts: number) {
		viewedDate = dayjs(ts * 1000);
		value = viewedDate;
		dispatch('new-value', value);
	}

	let open = false;
	let section: 'date' | 'time' = 'date';

	const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	let viewedDate: dayjs.Dayjs = dayjs();

	function resetToday() {
		viewedDate = dayjs();
		handleDone();
	}

	function nextMonth() {
		viewedDate = viewedDate.add(1, 'month');
	}

	function previousMonth() {
		viewedDate = viewedDate.subtract(1, 'month');
	}

	function handleDone() {
		open = false;
	}

	function selectDate(date: Dayjs) {
		if (dateOnly) {
			value = date.startOf('day');
		} else {
			value = date.hour(hours).minute(minutes);

			if (isPm) {
				value = viewedDate.add(12, 'hour');
			}
		}

		dispatch('new-value', value);
	}

	onMount(resetToday);

	let hours = 6;
	let minutes = 30;
	let monthDays = [];
	let isPm = false;

	$: inputText = formatDatetimeFromISO(value);

	$: monthWeekdayOffset = viewedDate.date(1).isoWeekday() - 1;

	interface DayInTable {
		day: number;
		isSelected: boolean;
		isToday: boolean;
		isDisabled: boolean;
		dayjs: dayjs.Dayjs;
	}

	$: {
		const fillBeforeDays = Array(monthWeekdayOffset)
			.fill(0)
			.map((_, i) => ({
				day: viewedDate.subtract(1, 'month').daysInMonth() - monthWeekdayOffset + i + 1,
				isDisabled: true,
				dayjs: viewedDate
					.subtract(1, 'month')
					.date(i + 1)
					.startOf('day'),
			}));

		const currentMonthDays = Array(viewedDate.daysInMonth())
			.fill(0)
			.map((_, i) => ({
				day: i + 1,
				dayjs: viewedDate
					.clone()
					.date(i + 1)
					.startOf('day'),
			}));

		const fillAfterDays = Array(42 - fillBeforeDays.length - currentMonthDays.length)
			.fill(0)
			.map((_, i) => ({
				day: i + 1,
				isDisabled: true,
				dayjs: viewedDate
					.add(1, 'month')
					.date(i + 1)
					.startOf('day'),
			}));

		monthDays = [...fillBeforeDays, ...currentMonthDays, ...fillAfterDays] as DayInTable[];

		const now = dayjs();

		monthDays = monthDays.map((d) => ({ ...d, isDisabled: d.isDisabled || (d.dayjs.endOf('day').isBefore(now) && !allowPastSelection) }));
	}
</script>

<div class="relative">
	<input {id} type="text" class="input w-full h-12" class:disabled:bg-gray-100={disabled} {placeholder} class:font-semibold={inputText} bind:value={inputText} disabled />

	<button class="w-20 absolute top-0 right-0 h-full border-l dropdown-gradient" on:click={() => (open = !open)} {disabled}>
		<div class="flex items-center justify-center space-x-2">
			<Calendar />
			<ArrowDown />
		</div>
	</button>

	{#if open}
		<div class="absolute top-0 right-0 w-full max-w-xs gradient-border-bg flex flex-col translate-y-14 p-[2px] z-10" style="box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.16);">
			<div class="bg-dark-gradient p-4">
				<!-- use:outsideClickCallback={{ cb: () => (open = false) }} -->
				<!-- Date/Time switch -->
				{#if !dateOnly}
					<div class="border-color-black border rounded-xl h-12 grid grid-cols-2 overflow-hidden flex-shrink-0">
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
				{/if}

				{#if section === 'date'}
					<div class="flex mt-4">
						<div class="flex-grow font-bold text-gradient text-lg">
							{viewedDate.format('MMM')}
							{viewedDate.year()}
						</div>
						<div class="flex-grow" />
						<div class="flex space-x-2 text-white">
							<button class="btn" on:click={previousMonth}><ChevronLeft /></button>
							<button class="btn" on:click={nextMonth}><ChevronRight /></button>
						</div>
					</div>

					<div class="flex font-semibold mt-6">
						{#each days as day}
							<div class="flex-grow text-center">{day}</div>
						{/each}
					</div>

					<div class="grid grid-cols-7 gap-px bg-white border mt-3">
						{#each monthDays as day}
							{@const isSelected = day.dayjs.toISOString() === value.toISOString()}
							<button class="flex-grow text-center aspect-1 text-sm font-medium bg-dark-gradient" class:font-bold={day.isToday} on:click={() => selectDate(day.dayjs)} disabled={day.isDisabled}>
								<div
									class="w-full h-full grid place-items-center"
									class:bg-dark-gradient={day.isDisabled}
									class:dropdown-gradient={!day.isDisabled && !isSelected}
									class:gradient-border-bg={isSelected}
								>
									{day.day}
								</div>
							</button>
						{/each}
					</div>

					{#if dateOnly}
						<div class="mt-4">
							<PrimaryButton on:click={handleDone}>Confirm</PrimaryButton>
						</div>
					{:else}
						<button class="btn btn-outline btn-rounded mt-4" on:click={() => (section = 'time')}>Select Time</button>
					{/if}
				{/if}

				{#if section === 'time'}
					<div class="flex justify-center mt-8">
						<Toggle bind:state={isPm} />
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

	.dropdown-gradient {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
</style>
