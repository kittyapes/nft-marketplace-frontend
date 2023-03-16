<script lang="ts">
	import type { CollectionRecord } from '..';

	export let data: CollectionRecord;
</script>

<div class="h-12 flex items-center gap-x-4">
	<img src={data.imageUrl} alt="" class="w-6 h-6" />
	<a href="/collections/{data.slug}">{data.label}</a>
</div>
