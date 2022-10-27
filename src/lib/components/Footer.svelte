<script>
	import { goto } from '$app/navigation';
	import { socials } from '$constants/socials';
</script>

<div class="border-t h-80 border-white border-opacity-50 text-white">
	<div class="container flex justify-between py-12 mx-auto">
		<div class="flex flex-col px-8 gap-4">
			<div class="h-12" on:click={() => goto('/')}>
				<img src="/svg/logo/logo.alpha.svg" class="h-full" alt="Hinata Logo" />
			</div>
			<div class="mt-3 font-semibold">The home of anime Web 3.0 content.</div>
			<a class="clickable font-semibold" href="www.hinata.foundation" target="_blank">www.hinata.foundation</a>
		</div>

		<div class="flex flex-col">
			<div class="font-semibold text-lg uppercase pb-4">Join our community</div>
			<div class="grid grid-cols-2 gap-6 font-semibold">
				<a href={socials.discord} target="_blank">Discord</a>
				<a href={socials.twitter} target="_blank">Twitter</a>
				<a href={socials.telegram} target="_blank">Telegram</a>
				<a href={socials.reddit} target="_blank">Reddit</a>
				<a href={socials.medium} target="_blank">Medium</a>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="font-semibold text-lg uppercase pb-4">Company</div>
			<div class="grid gap-2 font-semibold">
				<!-- <a href="!#">About</a> -->
				<a href={socials.careers} target="_blank" class="ml-4 lg:ml-0">Careers</a>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="font-semibold text-lg uppercase pb-4">Resources</div>
			<div class="font-semibold">
				<a href={socials.docs} target="_blank" class="ml-4 lg:ml-0">Docs</a>
			</div>
		</div>

		<div class="flex flex-col font-semibold">
			<div class="text-lg uppercase pb-4">Coming soon</div>
			<a href="#">Uniswap</a>
			<a href="#">AscendEx</a>
		</div>
	</div>

	<!-- Copyright -->
	<div class="container relative flex items-center justify-center mx-auto mt-8 text-xs">
		<span>Hinata Foundation &copy; 2021 - {new Date().getFullYear()}</span>
		<div class="absolute right-0 flex items-center justify-center w-auto tos">
			<a href="/terms-and-conditions">Terms & Conditions</a>
			<div class="w-[2px] h-4 bg-black mx-2 bg-opacity-50" />
			<a href="/privacy-policy">Privacy Policy</a>
		</div>
	</div>
</div>
