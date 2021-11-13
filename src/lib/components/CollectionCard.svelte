<script lang="ts">
	export let title: string;
	export let img: string;
</script>

<div class="w-72 rounded-2xl overflow-hidden border">
	<img src={img} alt="" class="h-32 w-full object-cover" />
	<div class="font-semibold h-10 grid place-items-center">{title}</div>
</div>
