<script>
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="bg-[#f2f2f2] py-16">
	<div class="max-w-4xl mx-auto py-16 bg-white px-16">
		<h1 class="uppercase text-center text-5xl font-semibold">
			Edit Your <span class="gradient-text">Profile</span>
		</h1>

		<div id="form-container" class="grid grid-cols-2 gap-y-6 mt-16">
			<div>Add your username*</div>
			<TextInput grayOutline placeholder="Username" />

			<div>Add your email</div>
			<TextInput grayOutline placeholder="example@email.com" />

			<div>Add your bio</div>
			<TextArea outline placeholder="Enter your short bio" maxChars={200} />

			<div>Upload a <br /> profile image</div>
			<DragDropImage />

			<div>Upload a <br /> background image</div>
			<DragDropImage />

			<div>Social links</div>
			<div id="socials-container" class="grid gap-y-3">
				<div>
					<Instagram />
					<TextInput grayOutline placeholder="Instagram link" />
				</div>

				<div>
					<Facebook />
					<TextInput grayOutline placeholder="Facebook link" />
				</div>

				<div>
					<Twitter />
					<TextInput grayOutline placeholder="Twitter link" />
				</div>
			</div>
		</div>

		<Button rounded variant="rounded-black" stretch class="mt-8">Save changes</Button>

		<div class="text-lg uppercase mt-6">* This field is mandatory</div>
	</div>
</div>

<style>
	#form-container > div {
		@apply uppercase text-lg;
	}

	#socials-container > div {
		@apply flex gap-x-2;
	}

	#socials-container > div > :global(input) {
		@apply flex-grow;
	}
</style>
