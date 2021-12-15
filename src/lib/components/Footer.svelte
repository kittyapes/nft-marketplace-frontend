<script>
	import { socials } from '$constants/socials';
	import FooterLogo from '$icons/footer-logo.svelte';
</script>

<div class="border-t h-80 border-[#1D1D1D4D] px-32">
	<div class="mx-auto py-12 flex justify-between gap-x-8">
		<div class="h-12">
			<FooterLogo />
		</div>

		<a href="/terms-and-conditions" class="doc-link h-12 grid place-items-center">
			Terms & Conditions
		</a>
		<a href="/privacy-policy" class="doc-link h-12 grid place-items-center">Privacy Policy</a>

		<div class="flex-grow" />

		<div class="grid xl:grid-cols-2 gap-x-4">
			<div class="perma-gray whitespace-nowrap">Join our community:</div>
			<div class="grid font-semibold gap-2">
				<a href={socials.discord} target="_blank">Discord</a>
				<a href={socials.twitter} target="_blank">Twitter</a>
				<a href={socials.telegram} target="_blank">Telegram</a>
				<!-- <a href={socials.reddit} target="_blank">Reddit</a> -->
				<!-- <a href={socials.medium} target="_blank">Medium</a> -->
			</div>
		</div>

		<div class="grid xl:grid-cols-2 gap-x-4 ml-8">
			<div class="perma-gray whitespace-nowrap">Latest news:</div>
			<div class="grid font-semibold gap-2 grid-rows-3">
				<!-- <a href="!#">About</a> -->
				<a href={socials.reddit} target="_blank">Reddit</a>
				<a href={socials.medium} target="_blank">Medium</a>
				<!-- <a href={socials.careers} target="_blank">Careers</a> -->
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="mx-auto flex items-center justify-center text-sm relative mt-8">
		Hinata &copy; 2012 - 2021
	</div>
</div>

<style>
	a {
		@apply whitespace-nowrap;
	}

	.perma-gray {
		color: #1d1d1d99;
	}

	.doc-link {
		color: #1d1d1d99;
		font-weight: 400;
	}
</style>
