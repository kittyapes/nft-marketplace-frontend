<script lang="ts">
	import VerifiedCreator from '$lib/icons/verified-creator.icon.svelte';

	export let title: string;
	export let description: string;
	export let coverImg: string;
	export let profileImg: string;
</script>

<div class="w-72 rounded-2xl overflow-hidden border">
	<img src={coverImg} alt="" class="h-32 w-full object-cover" />

	<div class="relative px-4">
		<img
			src={profileImg}
			alt=""
			class="rounded-full w-10 h-10 absolute -top-5 border-2 border-white"
		/>

		<div class="h-6" />

		<div class="flex gap-x-2">
			<div
				class="font-semibold h-8 bg-gradient-to-r bg-clip-text text-transparent from-color-purple to-color-blue"
			>
				{title}
			</div>

			<div class="translate-y-1">
				<VerifiedCreator />
			</div>
		</div>

		<div class="mb-4">{description}</div>
	</div>
</div>
