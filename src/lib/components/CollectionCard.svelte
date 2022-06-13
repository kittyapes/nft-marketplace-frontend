<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let slug: string;
	export let bannerUrl: string;
	export let logoUrl: string;
</script>

<div class="rounded-2xl w-[17rem] h-60 relative clickable" on:click={() => goto('/collections/' + slug)}>
	<div class="h-4/5 rounded-t-2xl">
		<img src={bannerUrl} alt="Collection banner." class="w-full h-full object-cover rounded-t-2xl" />
	</div>
	<div class="bg-white w-[1.75rem] h-[1.75rem] rounded-full absolute mx-auto left-0 right-0 bottom-[15%] grid place-items-center">
		<img src={logoUrl} alt="Collection Logo." class="w-6 h-6 rounded-full object-cover absolute" />
	</div>
	<div class="font-semibold grid place-items-center border-b border-x border-color-gray-light w-full rounded-b-2xl h-1/5">{title}</div>
</div>
