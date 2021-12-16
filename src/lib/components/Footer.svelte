<script>
	import { socials } from '$constants/socials';
</script>

<div class="border-t h-80 border-[#1D1D1D4D]">
	<div class="container mx-auto py-12 flex justify-between">
		<div class="flex flex-col px-8 w-1/4">
			<div class="h-12">
				<img src="/img/logo/logo.svg" class="h-full" alt="Hinata Logo" />
			</div>
			<div class="text-sm mt-3">The home of anime Web 3.0 content.</div>
		</div>

		<div class="w-3/4 flex justify-between items-start">
			<div class="grid grid-cols-2 gap-x-4">
				<div class="perma-gray">Join our community:</div>
				<div class="grid font-semibold gap-2">
					<a href={socials.twitter} target="_blank">Twitter</a>
					<a href={socials.discord} target="_blank">Discord</a>
					<a href={socials.telegram} target="_blank">Telegram</a>
					<a href={socials.reddit} target="_blank">Reddit</a>
					<a href={socials.medium} target="_blank">Medium</a>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 ml-8">
				<div class="perma-gray">Company:</div>
				<div class="grid font-semibold gap-2">
					<!-- <a href="!#">About</a> -->
					<a href={socials.careers} target="_blank">Careers</a>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-4 ml-8">
				<div class="perma-gray">Trade $HiNATA:</div>
				<div class="grid font-semibold gap-2">
					<!-- <a href="!#">Uniswap</a> -->
					<!-- <a href="!#">AscendEx</a> -->
					<div class="text-gray-500">Coming soon!</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="container mx-auto flex items-center justify-center text-xs relative mt-8">
		<span class="doc-link">Hinata Foundation &copy; 2012 - 2021</span>
		<div class="tos flex justify-center items-center w-auto absolute right-0">
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
