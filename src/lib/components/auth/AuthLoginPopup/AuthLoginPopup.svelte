<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import Button from '$lib/components/Button.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { AuthLoginPopupAdapter, AuthLoginPopupState } from './authLoginPopupAdapter';

	const dispatch = createEventDispatcher();

	let state: AuthLoginPopupState = 'prompt';

	export let adapter: AuthLoginPopupAdapter;

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

	$: prompt = adapter.getPrompt();
</script>

<Popup closeButton class="w-[500px] h-[220px] flex flex-col items-center" on:close>
	{#if state === 'prompt'}
		<div class="title">
			{@html prompt.title}
		</div>

		<button class="btn btn-gradient btn-rounded mt-12 uppercase" on:click={onSignIn}>
			Sign In
		</button>
	{/if}

	{#if state === 'loading'}
		<div class="title mb-12">Sign this message</div>
		<Loader />
	{/if}

	{#if state === 'confirm'}
		<div class="title">Sign this message</div>
		<div class="text-xs mt-8">{message}</div>
		<div class="mt-6 gap-x-8 flex scale-75">
			<Button variant="rounded-outline" rounded on:click={onSignCancel}>Cancel</Button>
			<Button gradient rounded on:click={onSignConfirm}>Sign</Button>
		</div>
	{/if}

	{#if state === 'success'}
		<div class="title">Sign this message</div>
		<div class="text-sm mt-8 font-bold">Signing Successful!</div>
		<Button gradient rounded class="mt-6" on:click={dispatchClose}>Continue</Button>
	{/if}

	{#if state === 'error'}
		<div class="title">Sign this message</div>
		<div class="text-sm mt-8 font-bold">Signing Failed!</div>
		<div class="mt-6 gap-x-8 flex scale-75">
			<Button variant="rounded-outline" rounded on:click={dispatchClose}>Cancel</Button>
			<Button gradient rounded on:click={onSignIn}>Try again</Button>
		</div>
	{/if}
</Popup>

<style>
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
