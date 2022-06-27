<script lang="ts">
	import VerifiedCreator from '$icons/verified-creator.svelte';

	export let title: string;
	export let description: string;
	export let coverImg: string;
	export let profileImg: string;
</script>

<div class="rounded-2xl overflow-hidden border w-full  clickable">
	<img src={coverImg} alt="" class="h-32 w-full object-cover" />

	<div class="relative px-4">
		<div class="bg-white w-[3.25rem] h-[3.25rem] rounded-full grid place-items-center absolute -top-8">
			<img
				src={profileImg ||
					'https://media.istockphoto.com/photos/abstract-geometric-network-polygon-globe-graphic-background-picture-id1208738316?b=1&k=20&m=1208738316&s=170667a&w=0&h=f4KWULKjL770nceDM6xi32EbfIgMtBwSp5fPxIx08wc='}
				alt="Collection Logo."
				class="w-12 h-12 rounded-full object-cover"
			/>
		</div>

		<div class="h-6" />

		<div class="flex gap-x-2 items-center">
			<div class="font-semibold h-8 bg-gradient-to-r bg-clip-text text-transparent from-color-purple to-color-blue grid place-items-center">
				@{title}
			</div>

			<VerifiedCreator />
		</div>

		<div class="mb-4">{description}</div>
	</div>
</div>
