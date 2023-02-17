<script lang="ts">
	import { browser } from '$app/environment';
	import type { UserRole } from '$interfaces/userData';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { deleteNotification, getNotifications, publishNotification, updateNotificationAsAdmin, type UpdateNotificationAsAdminOptions, type UserNotification } from '$utils/api/notifications';
	import { notifyError, notifySuccess } from '$utils/toast';
	import type { Dayjs } from 'dayjs';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';

	let notificationMessage = '';
	let notificationTitle = '';
	let publishDate: Dayjs;
	let expireDate: Dayjs;

	type TargetOptions = {
		value: 'GLOBAL' | UserRole;
		label: string;
	};

	let target: TargetOptions;

	const targetDropdownOptions: TargetOptions[] = [
		{
			value: 'GLOBAL',
			label: 'Global',
		},
		{
			value: 'superadmin',
			label: 'Superadmins',
		},
		{
			value: 'admin',
			label: 'Admins',
		},
		{
			value: 'verified_user',
			label: 'Verified users',
		},
		{
			value: 'inactivated_user',
			label: 'Inactivated users',
		},
		{
			value: 'user',
			label: 'Authenticated users',
		},
	];

	type LocalUserNotification = UserNotification & {
		editMode?: boolean;
		editExpireDate?: Dayjs;
		editPublishDate?: Dayjs;
	};

	let createdNotifications: LocalUserNotification[];

	$: browser && $currentUserAddress && fetchNotifications();

	async function fetchNotifications() {
		const res = await getNotifications();

		if (res.err) {
			notifyError('Failed to get published notifications ' + res.err.message);
			return;
		}

		createdNotifications = res.data.data;
		createdNotifications.forEach((n) => (n.editMode = false));
	}

	async function handlePublish() {
		const res = await publishNotification({
			title: notificationTitle,
			content: notificationMessage,
			targets: [target.value],
			location: target.value === 'GLOBAL' ? 'GLOBAL' : 'NOTIFICATION_AREA',
			publishAt: publishDate ? publishDate.format() : dayjs().format(),
			expireAt: expireDate?.format() || undefined,
		});

		if (res.err) {
			notifyError('Failed to publish notification ' + res.err.message);
			return;
		} else {
			notifySuccess('Sucessfully published notification');
			notificationMessage = '';
			notificationTitle = '';
			publishDate = null;
			expireDate = null;
		}

		fetchNotifications();
	}

	async function handleDelete(notificationId: string) {
		const res = await deleteNotification(notificationId);

		if (!res.data.data.deletedNotification || !res.data.data.deletedUserNotification) {
			notifyError('Something went wrong when deleting the notification');
			return;
		}

		const removedNotification = createdNotifications.find((n) => n.notificationId === notificationId);

		createdNotifications.splice(createdNotifications.indexOf(removedNotification), 1);

		fetchNotifications();
	}

	async function handleEdit(notification: LocalUserNotification) {
		const options: UpdateNotificationAsAdminOptions = {
			id: notification.notificationId,
			content: notification.content || undefined,
			...(notification.editPublishDate ? { publishAt: dayjs(notification.editPublishDate).format('YYYY-MM-DDTHH:mm:ss.SSS') } : {}),
			...(notification.editExpireDate ? { expireAt: dayjs(notification.editExpireDate).format('YYYY-MM-DDTHH:mm:ss.SSS') } : {}),
		};

		const res = await updateNotificationAsAdmin(options);

		if (res.err) {
			notifyError('Failed to edited notification ' + res.err.message);
			return;
		} else {
			notifySuccess('Sucessfully edited notification');
		}

		fetchNotifications();
	}
</script>

<main class="text-white">
	<section class="flex gap-x-40 gap-y-12 mt-20 flex-wrap ">
		<div class="flex flex-col justify-evenly gap-8 w-1/3">
			<h1 class="text-2xl">Create a Notification</h1>

			<div class="flex flex-col gap-2">
				<h2 class="text-lg">Publish date</h2>
				<Datepicker bind:value={publishDate} placeholder="Pick publish date & time" />
			</div>

			<div class="flex flex-col gap-2">
				<h2 class="text-lg">Expire date</h2>
				<Datepicker bind:value={expireDate} placeholder="Pick expire date & time" />
			</div>

			<div class="flex flex-col gap-2">
				<h2 class="text-lg">Target audience</h2>
				<Dropdown bind:selected={target} options={targetDropdownOptions} class="h-12" />
			</div>
		</div>
		<div class="flex-col flex-grow w-1/3">
			<TextArea bind:value={notificationMessage} maxChars={100} containerClass={'text-white'} textAreaClass={'placeholder:text-white'} placeholder={'Enter your message for a notification'} />
		</div>

		<PrimaryButton disabled={!notificationMessage} on:click={handlePublish} extButtonClass="w-80 mt-8 max-w-full">Publish</PrimaryButton>
	</section>

	{#if createdNotifications?.length > 0}
		<div class="" transition:slide>
			<hr class="border-b border-white mt-20" />

			<section class="my-10 blue-scrollbar">
				<h1 class="text-3xl mb-20">Notifications currently active</h1>

				<div class="flex flex-col gap-y-24">
					{#each createdNotifications as notification}
						<div class="flex gap-10 justify-between w-full" transition:slide|local>
							<div class="w-[50%] flex flex-col justify-between flex-wrap">
								{#if notification.editMode}
									<div class="flex gap-8 flex-wrap">
										<PrimaryButton variant="green" disabled={!notification.content} on:click={() => handleEdit(notification)}>Confirm</PrimaryButton>

										<PrimaryButton
											variant="red"
											on:click={() => {
												notification.editExpireDate = null;
												notification.editPublishDate = null;
												notification.editMode = false;
											}}
										>
											Cancel
										</PrimaryButton>
									</div>
									<div class="flex justify-between flex-wrap gap-2">
										<div class="flex flex-col">
											<span class="text-lg">Publish date:</span>
											<Datepicker bind:value={notification.editPublishDate} placeholder="Edit publish date & time" />
										</div>
										<div class="flex flex-col">
											<span class="text-lg">Expire date:</span>
											<Datepicker bind:value={notification.editExpireDate} placeholder="Edit expire date & time" />
										</div>
									</div>
								{:else}
									<div class="flex gap-8 flex-wrap">
										<PrimaryButton
											on:click={() => {
												notification.editMode = true;
											}}
										>
											Edit
										</PrimaryButton>

										<PrimaryButton variant="red" on:click={() => handleDelete(notification.notificationId)}>Delete</PrimaryButton>
									</div>
									<div class="flex justify-between">
										{#if notification.targets}
											<div class="flex flex-col">
												<span>Targets:</span>
												<span>{notification.targets[0]}</span>
											</div>
										{/if}
									</div>
									<div class="flex justify-between">
										<div class="flex flex-col">
											<span>Created on:</span>
											<span>{dayjs(notification.createdAt).format('DD-MM-YYYY HH:mm')}</span>
										</div>
										<div class="flex flex-col">
											<span>Published on:</span>
											<span>{dayjs(notification.publishAt).format('DD-MM-YYYY HH:mm')}</span>
										</div>
									</div>
									<div class="flex justify-between">
										<div class="flex flex-col">
											<span>Edited on:</span>
											<span>{dayjs(notification.updatedAt).format('DD-MM-YYYY HH:mm')}</span>
										</div>

										{#if notification.expireAt}
											<div class="flex flex-col">
												<span>Expires on:</span>
												<span>{dayjs(notification.expireAt).format('DD-MM-YYYY HH:mm')}</span>
											</div>
										{/if}
									</div>
								{/if}
							</div>
							<div class="w-[50%]">
								<TextArea
									bind:value={notification.content}
									disabled={!notification.editMode}
									maxChars={100}
									containerClass={'text-white'}
									textAreaClass={'placeholder:text-white'}
									placeholder={'No content'}
								/>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</main>
