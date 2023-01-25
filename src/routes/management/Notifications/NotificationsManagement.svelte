<script lang="ts">
	import { browser } from '$app/environment';
	import TextArea from '$lib/components/TextArea.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { getNotifications, publishNotification } from '$utils/api/notifications';
	import { notifyError, notifySuccess } from '$utils/toast';
	import dayjs from 'dayjs';

	let notificationMessage = '';
	let notificationTitle = 'random title';
	let publishedNotifications = [];

	$: browser && fetchNotification();
	$: console.log(publishedNotifications);

	async function fetchNotification() {
		const res = await getNotifications();

		if (res.err) {
			notifyError('Failed to get published notifications ' + res.err.message);
			return;
		}

		publishedNotifications = res.data.data;
	}

	async function handlePublish() {
		const res = await publishNotification({ title: notificationTitle, content: notificationMessage, targets: ['GLOBAL'], publishAt: dayjs().format('YYYY-MM-DD') });

		if (res.err) {
			notifyError('Failed to publish notification ' + res.err.message);
			return;
		} else {
			notifySuccess('Sucessfully published notification');
		}
	}
</script>

<main class="text-white">
	<section class="flex gap-60 mt-20">
		<div class="flex flex-col justify-between -translate-y-[7px]">
			<h1 class="text-2xl">Create a Notification</h1>

			<PrimaryButton disabled={!notificationMessage} on:click={handlePublish} extButtonClass="w-80">Publish</PrimaryButton>
		</div>
		<div class="flex-col flex-grow">
			<TextArea bind:value={notificationMessage} maxChars={250} containerClass={'text-white'} textAreaClass={'placeholder:text-white'} placeholder={'Enter your message for a notification'} />
		</div>
	</section>

	{#if publishedNotifications?.length > 0}
		<hr class="border-b border-white mt-20" />

		<section class="mt-20">
			<h1 class="text-2xl">Notifications currently active</h1>
		</section>
	{/if}
</main>
