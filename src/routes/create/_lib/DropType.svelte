<script>
	export let imgUrl;
	export let title;
</script>

<div class="flex flex-col items-center justify-center">
	<img src={imgUrl} alt="" />
	<div class="font-bold">{title}</div>
</div>
