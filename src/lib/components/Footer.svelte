<script>
	import { goto } from '$app/navigation';
	import { socials } from '$constants/socials';
	import ArrowLinkGradient from '$icons/arrow-link-gradient.svelte';
</script>

<div class="border-t border-white text-white -z-10 ">
	<div class="flex justify-between py-12 px-32 gap-10">
		<div class="flex flex-col px-8 gap-4">
			<!-- Logo -->
			<div on:click={() => goto('/')} class="">
				<img src="/svg/logo/logo.v2.svg" alt="Hinata logo." />
			</div>
			<div class="mt-3">The home of anime Web 3.0 content.</div>
			<a class="clickable" href="https://www.hinata.foundation" target="_blank">www.hinata.foundation</a>
		</div>

		<div class="flex flex-col">
			<div class="text-lg uppercase pb-4">Join our community</div>
			<div class="grid grid-cols-2 gap-6">
				<a href={socials.discord} target="_blank" class="flex gap-2 items-center clickable">
					<div>Discord</div>
					<ArrowLinkGradient />
				</a>
				<a href={socials.twitter} target="_blank" class="flex gap-2 items-center clickable">
					<div>Twitter</div>
					<ArrowLinkGradient />
				</a>
				<a href={socials.telegram} target="_blank" class="flex gap-2 items-center clickable">
					<div>Telegram</div>
					<ArrowLinkGradient />
				</a>
				<a href={socials.reddit} target="_blank" class="flex gap-2 items-center clickable">
					<div>Reddit</div>
					<ArrowLinkGradient />
				</a>
				<a href={socials.medium} target="_blank" class="flex gap-2 items-center clickable">
					<div>Medium</div>
					<ArrowLinkGradient />
				</a>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="text-lg uppercase pb-4">Company</div>
			<a href={socials.careers} target="_blank" class="flex gap-2 items-center clickable">
				<div class="ml-4 lg:ml-0">Careers</div>
				<ArrowLinkGradient />
			</a>
		</div>

		<div class="flex flex-col">
			<div class="text-lg uppercase pb-4">Resources</div>
			<a href={socials.docs} target="_blank" class="flex gap-2 items-center clickable">
				<div class="ml-4 lg:ml-0">Docs</div>
				<ArrowLinkGradient />
			</a>
		</div>

		<!-- TODO: add links -->
		<div class="flex flex-col ">
			<div class="text-lg uppercase pb-4">Coming soon</div>
			<div class="flex flex-col gap-6">
				<a href="/" class="flex gap-2 items-center clickable">
					<div>Uniswap</div>
					<ArrowLinkGradient />
				</a>
				<!-- <a href="/" class="flex gap-2 items-center clickable">
					<div>AscendEx</div>
					<ArrowLinkGradient />
				</a> -->
			</div>
		</div>
	</div>

	<hr class="w-full h-0 gradient-border border-x-0 border-b-0" />

	<!-- Copyright -->
	<div class="relative flex items-center justify-center text-sm w-full py-4">
		<span>
			&copy; 2021 - {new Date().getFullYear()}
			<span class="text-gradient">Hinata Foundation</span>
		</span>
		<!-- <div class="absolute right-0 flex items-center justify-center w-auto tos">
			<a href="/terms-and-conditions">Terms & Conditions</a>
			<div class="w-[2px] h-4 bg-black mx-2 bg-opacity-50" />
			<a href="/privacy-policy">Privacy Policy</a>
		</div>-->
	</div>
</div>
