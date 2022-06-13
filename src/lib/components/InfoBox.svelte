<script>
	import { getIconUrl } from '$utils/misc/getIconUrl';
</script>

<div class="p-[2px] rounded-xl bg-gradient-to-r from-color-purple to-color-blue">
	<div class="flex items-start gap-4 px-6 py-4 bg-white rounded-[10px]">
		<img class="w-6" src={getIconUrl('info')} alt="Info." />

		<div class="font-bold gradient-text"><slot /></div>
	</div>
</div>
