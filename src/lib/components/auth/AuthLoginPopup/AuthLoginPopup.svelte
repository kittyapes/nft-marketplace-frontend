<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import Button from '$lib/components/Button.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { AuthLoginPopupAdapter, AuthLoginPopupState } from './authLoginPopupAdapter';
	import type { PopupHandler } from '$utils/popup';
	import { refreshProfileData } from '$stores/user';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import GhostButton from '$lib/components/v2/GhostButton.svelte';

	const dispatch = createEventDispatcher();

	let state: AuthLoginPopupState = 'prompt';

	export let adapter: AuthLoginPopupAdapter;
	export let onLoginSuccess: () => void;
	export let handler: PopupHandler;

	let message: string;

	async function onSignIn() {
		state = 'loading';

		message = await adapter.getMessageToSign($currentUserAddress);

		if (message) {
			state = 'confirm';
		} else {
			onError();
		}
	}

	async function onSignCancel() {
		state = 'prompt';
		handler.close();
	}

	async function onSignConfirm() {
		state = 'loading';

		const address = $currentUserAddress;

		const signature = await $appSigner.signMessage(message).catch(onError);

		if (!signature) {
			onError();
			return;
		}

		const token = await adapter.getAuthToken(address, signature);

		if (!token) {
			onError();
			return;
		}

		adapter.useToken(address, token);

		state = 'success';
	}

	async function onError() {
		state = 'error';
	}

	function dispatchClose() {
		dispatch('close');
	}

	function onSuccessClose() {
		if (onLoginSuccess) {
			onLoginSuccess();
		}

		handler.close();
	}

	$: prompt = adapter.getPrompt();
</script>

<Popup closeButton class="w-[500px] h-[220px] flex flex-col items-center text-white bg-dark-gradient" on:close>
	{#if state === 'prompt'}
		<div class=" bg-dark-gradient w-full h-full">
			<div class="flex flex-col gap-10 p-8 items-center">
				<div class="title">
					{@html prompt.title}
				</div>
				<PrimaryButton on:click={onSignIn}><span class="uppercase">Sign In</span></PrimaryButton>
			</div>
		</div>
	{/if}

	{#if state === 'loading'}
		<div class="flex flex-col gap-6 p-6 items-center bg-dark-gradient w-full h-full">
			<div class="title">Sign this message</div>
			<Loader />
		</div>
	{/if}

	{#if state === 'confirm'}
		<div class=" bg-dark-gradient w-full h-full">
			<div class="w-full flex flex-col gap-6 p-6 items-center">
				<div class="title">Sign this message</div>
				<div class="text-xs">{message}</div>
				<div class="w-full flex gap-x-8 2xl:gap-x-10">
					<GhostButton on:click={onSignCancel}><span class="uppercase">Cancel</span></GhostButton>
					<PrimaryButton on:click={onSignConfirm}><span class="uppercase">Sign</span></PrimaryButton>
				</div>
			</div>
		</div>
	{/if}

	{#if state === 'success'}
		<div class=" bg-dark-gradient w-full h-full">
			<div class="flex flex-col gap-6 p-6 items-center">
				<div class="title">Sign this message</div>
				<div class="text-sm font-bold">Signing Successful!</div>
				<PrimaryButton on:click={onSuccessClose}><span class="uppercase">Continue</span></PrimaryButton>
			</div>
		</div>
	{/if}

	{#if state === 'error'}
		<div class=" bg-dark-gradient w-full h-full">
			<div class="w-full flex flex-col gap-6 p-6 items-center">
				<div class="title">Sign this message</div>
				<div class="text-sm font-bold">Signing Failed!</div>
				<div class="w-full flex gap-x-8 2xl:gap-x-10">
					<GhostButton on:click={handler.close}><span class="uppercase">Cancel</span></GhostButton>
					<PrimaryButton on:click={onSignIn}><span class="uppercase">Try again</span></PrimaryButton>
				</div>
			</div>
		</div>
	{/if}
</Popup>

<style type="postcss">
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
