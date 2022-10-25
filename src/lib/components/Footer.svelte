<script>
	import { goto } from '$app/navigation';
	import { socials } from '$constants/socials';
</script>

<div class="border-t h-80 border-color-gray-light">
	<div class="container flex justify-between py-12 mx-auto">
		<div class="flex flex-col w-1/4 px-8">
			<div class="h-12" on:click={() => goto('/')}>
				<img src="/svg/logo/logo.alpha.svg" class="h-full" alt="Hinata Logo" />
			</div>
			<div class="mt-3 text-sm">The home of anime Web 3.0 content.</div>
		</div>

		<div class="flex items-start justify-between w-3/4">
			<div class="grid grid-cols-2 gap-x-4">
				<div class="perma-gray">Join our community:</div>
				<div class="grid gap-2 font-semibold">
					<a href={socials.discord} target="_blank">Discord</a>
					<a href={socials.twitter} target="_blank">Twitter</a>
					<a href={socials.telegram} target="_blank">Telegram</a>
					<a href={socials.reddit} target="_blank">Reddit</a>
					<a href={socials.medium} target="_blank">Medium</a>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 lg:ml-8">
				<div class="perma-gray">Company:</div>
				<div class="grid gap-2 font-semibold">
					<!-- <a href="!#">About</a> -->
					<a href={socials.careers} target="_blank" class="ml-4 lg:ml-0">Careers</a>
				</div>

				<div class="perma-gray mt-5">Resources:</div>
				<div class="grid gap-2 font-semibold  mt-5">
					<a href={socials.docs} target="_blank" class="ml-4 lg:ml-0">Docs</a>
				</div>
			</div>

			<div class="grid grid-cols-2 ml-8 gap-x-4">
				<div class="perma-gray">Trade $HiNATA:</div>
				<div class="grid gap-2 font-semibold">
					<!-- <a href="!#">Uniswap</a> -->
					<!-- <a href="!#">AscendEx</a> -->
					<div class="text-gray-500">Coming soon!</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="container relative flex items-center justify-center mx-auto mt-8 text-xs">
		<span class="doc-link">Hinata Foundation &copy; 2021 - {new Date().getFullYear()}</span>
		<div class="absolute right-0 flex items-center justify-center w-auto tos">
			<a href="/terms-and-conditions" class="doc-link">Terms & Conditions</a>
			<div class="w-[2px] h-4 bg-black mx-2 bg-opacity-50" />
			<a href="/privacy-policy" class="doc-link">Privacy Policy</a>
		</div>
	</div>
</div>

<style>
	.perma-gray {
		color: #1d1d1d99;
	}
	.doc-link {
		color: #1d1d1d99;
		font-weight: 400;
	}
</style>
