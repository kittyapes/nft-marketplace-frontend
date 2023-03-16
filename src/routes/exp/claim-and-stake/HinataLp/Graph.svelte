<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	let context: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		chart = new Chart(context, {
			type: 'line',
			data: {
				labels: [1, 2, 3, 4, 5, 6],
				datasets: [
					{
						data: [1, 6, 1, 5, 1, 4],
						fill: true,
						borderColor: '#96A5FD',
						backgroundColor: '#2B3F50',
						pointStyle: false,
					},
				],
			},
			options: {
				plugins: {
					legend: { display: false },
				},
				scales: {
					x: {
						display: false,
					},

					y: {
						display: false,
					},
				},
			},
		});
	});
</script>

<div class="text-gradient">
	<span class="text-lg">${0}k</span>
	•
	<span class="text-sm">${0} Earned</span>
</div>

<div>{'20 Feb 2023 12:00'}</div>

<canvas bind:this={context} />
