<script>
	import { getIconUrl } from '$utils/misc/getIconUrl';
</script>

<div class="p-[2px] rounded-xl gradient-border">
	<div class="flex items-start gap-4 px-6 py-4 {$$props.class}">
		<img class="w-6" src={getIconUrl('info')} alt="Info." />

		<div class="text-gradient"><slot /></div>
	</div>
</div>
