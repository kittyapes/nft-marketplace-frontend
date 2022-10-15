<script lang="ts">
	export let title: string;
</script>

<div>
	<h2 class="font-semibold bg-gray-100 rounded-md p-2 max-w-max font-mono mb-2">{title}</h2>

	<slot />
</div>
