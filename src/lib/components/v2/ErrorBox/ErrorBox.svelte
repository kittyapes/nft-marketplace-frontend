<script lang="ts">
	import InfoV2 from '$icons/info-v2.svelte';
</script>

<div class="text-white p-px --outer-bg">
	<div class="--inner-bg flex items-center gap-4 px-4 py-3">
		<div class="w-8 h-8 flex-shrink-0 hidden sm:block">
			<InfoV2 />
		</div>

		<div>
			<span class="font-medium">
				<slot name="errorTitle" />
			</span>

			<slot name="errorDetail" />
		</div>
	</div>
</div>

<style>
	.--outer-bg {
		background: linear-gradient(90deg, #ff297c 0.46%, #f21e91 49.71%, #fc0363 100%);
	}

	.--inner-bg {
		background: #131213 linear-gradient(90deg, rgba(255, 41, 124, 0.2) 0.46%, rgba(242, 30, 145, 0.2) 49.71%, rgba(252, 3, 99, 0.2) 100%);
	}
</style>
