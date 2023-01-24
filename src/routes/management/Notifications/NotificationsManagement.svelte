<script>
	import TextArea from '$lib/components/TextArea.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';

	let notificationMessage = '';
</script>

<main class="text-white">
	<section class="flex gap-60 mt-20">
		<div class="flex flex-col justify-between -translate-y-[7px]">
			<h1 class="text-2xl">Create a Notification</h1>

			<PrimaryButton extButtonClass="w-80 ">Publish</PrimaryButton>
		</div>
		<div class="flex-col flex-grow">
			<TextArea bind:value={notificationMessage} maxChars={250} containerClass={'text-white'} textAreaClass={'placeholder:text-white'} placeholder={'Enter your message for a notification'} />
		</div>
	</section>

	<hr class="border-b border-white mt-20" />

	<section class="mt-20">
		<h1 class="text-2xl">Notifications currently active</h1>
	</section>
</main>
