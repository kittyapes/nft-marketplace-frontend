<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import Button from '$lib/components/Button.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { AuthLoginPopupAdapter, AuthLoginPopupState } from './authLoginPopupAdapter';
	import type { PopupHandler } from '$utils/popup';
	import { refreshProfileData } from '$stores/user';

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

<Popup closeButton class="w-[500px] h-[220px] flex flex-col items-center pt-8" on:close>
	{#if state === 'prompt'}
		<div class="title">
			{@html prompt.title}
		</div>

		<button class="mt-12 uppercase btn btn-gradient btn-rounded" on:click={onSignIn}>Sign In</button>
	{/if}

	{#if state === 'loading'}
		<div class="mb-12 title">Sign this message</div>
		<Loader />
	{/if}

	{#if state === 'confirm'}
		<div class="title">Sign this message</div>
		<div class="mt-8 text-xs">{message}</div>
		<div class="flex mt-6 scale-75 gap-x-8">
			<Button variant="rounded-outline" rounded on:click={onSignCancel}>Cancel</Button>
			<Button gradient rounded on:click={onSignConfirm}>Sign</Button>
		</div>
	{/if}

	{#if state === 'success'}
		<div class="title">Sign this message</div>
		<div class="mt-8 text-sm font-bold">Signing Successful!</div>
		<Button gradient rounded class="mt-6" on:click={onSuccessClose}>Continue</Button>
	{/if}

	{#if state === 'error'}
		<div class="title">Sign this message</div>
		<div class="mt-8 text-sm font-bold">Signing Failed!</div>
		<div class="flex mt-6 scale-75 gap-x-8">
			<Button variant="rounded-outline" rounded on:click={dispatchClose}>Cancel</Button>
			<Button gradient rounded on:click={onSignIn}>Try again</Button>
		</div>
	{/if}
</Popup>

<style type="postcss">
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
