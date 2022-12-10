<script>
	export let imgUrl;
	export let title;
</script>

<div class="flex items-center justify-center">
	<img src={imgUrl} alt="" />
	<div class="font-bold mt-4">{title}</div>
</div>
