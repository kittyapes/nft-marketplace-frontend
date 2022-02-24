<script>
	export let imageUrl;
	export let title;
	export let description;
</script>

<div class="flex flex-col justify-center items-center px-16">
	<img src={imageUrl} alt="" class="h-40" />
	<div class="font-bold text-xl">{title}</div>
	<div class="text-[#1D1D1DB2] text-center font-semibold mt-2">{description}</div>
</div>
