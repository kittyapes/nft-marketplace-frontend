<script lang="ts">
	import { goto } from '$app/navigation';
	import DisconnectV2 from '$icons/disconnect-v2.svelte';
	import { profileData, publicProfileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { disconnectWallet } from '$utils/wallet/connectWallet';
	import { slide } from 'svelte/transition';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { getNotifications, updateNotificationAsUser, type UserNotification } from '$utils/api/notifications';
	import dayjs from 'dayjs';
	import { userHasRole } from '$utils/auth/userRoles';
	import type { UserRole } from '$interfaces/userData';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import ThemedCross from '$icons/themed-cross.svelte';

	dayjs.extend(relativeTime);

	const dispatch = createEventDispatcher();

	let showDashboard = false;
	let showMyCollections = false;
	let disconnected = false;

	publicProfileData.subscribe((publicProfile) => {
		// Checking for saved roles since last login present in public profile object
		showMyCollections = publicProfile && (publicProfile.roles.includes('verified_user') || publicProfile.roles.includes('superadmin'));
		showDashboard = publicProfile && (publicProfile.roles.includes('admin') || publicProfile.roles.includes('superadmin'));
	});

	function checkDisconnect() {
		if (!disconnected) return;

		disconnectWallet();
		dispatch('disconnect');

		disconnected = false;
	}

	let userNotifications = writable<UserNotification[]>(null);
	let loadedUserNotifications = writable(false);
	// in miliseconds
	const notificationFetchingTime = 30_000;

	const getUserNotification = async () => {
		if (!$userNotifications) loadedUserNotifications.set(false);
		const res = (await getNotifications()).data.data;

		const notifications = res.filter(
			(n) =>
				!n.hasCleared && $userHasRole(n.targets?.[0] as UserRole) && n.location === 'NOTIFICATION_AREA' && dayjs().isAfter(dayjs(n.publishAt)) && (!n.expireAt || dayjs().isBefore(dayjs(n.expireAt))),
		);

		if (!notifications.length) {
			userNotifications.set(null);
			loadedUserNotifications.set(true);
			return;
		}

		userNotifications.set(notifications);

		loadedUserNotifications.set(true);
		notifications.forEach(async (n) => {
			if (!n.readAt) await updateNotificationAsUser({ id: n._id, readAt: dayjs().format(), hasCleared: false });
		});
	};

	const clearNotification = async (id: string) => {
		await updateNotificationAsUser({ id: id, hasCleared: true });
		$userNotifications = $userNotifications.filter((n) => n._id !== id);
	};

	let notificationFetchingInterval = setInterval(() => {
		getUserNotification();
	}, notificationFetchingTime);

	onDestroy(() => clearInterval(notificationFetchingInterval));

	$: if ($currentUserAddress) {
		getUserNotification();
	}
</script>

<div
	id="profile-popup-container"
	class="absolute bg-dark-gradient w-[273px] 2xl:w-[341px] top-14 right-0 rounded-none border-gradient z-10 px-4 py-4 overflow-hidden"
	transition:slide
	on:outroend={checkDisconnect}
>
	<div class="flex flex-col gap-y-5 2xl:gap-y-6 text-white">
		{#if $loadedUserNotifications && $userNotifications?.length}
			<div class="">
				<h1 class="text-2xl">Notifications</h1>
				<div class="flex flex-col gap-4 mt-4 max-h-80 overflow-y-auto blue-scrollbar">
					{#each $userNotifications as notification}
						<div class="flex flex-col gap-2 p-2 notification-item">
							<p>{notification.content}</p>
							<div class="flex justify-between">
								<p class:text-gradient-green={!notification.readAt}>{dayjs(notification.publishAt).fromNow()}</p>
								<button on:click={() => clearNotification(notification._id)}>
									<ThemedCross />
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<PrimaryButton on:click={() => goto(`/profile/${$currentUserAddress}`)}>My Profile</PrimaryButton>

		{#if showDashboard}
			<PrimaryButton on:click={() => goto('/management')}>Dashboard</PrimaryButton>
		{/if}

		{#if showMyCollections}
			<PrimaryButton on:click={() => goto(`/profile/${$publicProfileData.address}/collections`)}>My Collections</PrimaryButton>
		{/if}

		<!-- <PrimaryButton on:click={() => alert('Not Implemented Yet')}>Buy Hinata</PrimaryButton> -->

		<div class="h-px border-gradient border-0 border-t-2" />
		<button class="flex w-full transition-btn profile-btn-item items-center" id="nav-disconnect-btn" on:click={() => (disconnected = true)}>
			<span class="capitalize text-lg leading-5 flex-grow text-left font-semibold">Disconnect</span>
			<DisconnectV2 class="w-5 h-5" />
		</button>
	</div>
</div>

<style>
	#profile-popup-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}

	.notification-item:hover {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
</style>
