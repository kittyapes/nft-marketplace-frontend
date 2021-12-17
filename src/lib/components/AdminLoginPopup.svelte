<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import { login, requestLogin } from '$lib/api/login';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { setAuthToken } from '$utils/api';
	import { closePopup } from '$utils/popup';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';

	type State = 'prompt' | 'loading' | 'confirm' | 'success' | 'error';
	let state: State = 'prompt';

	let message: string;

	async function onSignIn() {
		state = 'loading';
		requestLogin($currentUserAddress).then((mess) => {
			message = mess;
			state = 'confirm';
		}, onError);
	}

	async function onSignCancel() {
		state = 'prompt';
	}

	async function onSignConfirm() {
		state = 'loading';

		const signature = await $appSigner.signMessage(message).catch(onError);

		signature && login($currentUserAddress, signature).then(onSignSuccess, onError);
	}

	async function onSignSuccess(token: string) {
		state = 'success';

		setAuthToken(token);
	}

	async function onError() {
		state = 'error';
	}
</script>

<Modal>
	<div class="bg-white rounded-2xl w-[500px] h-[220px] flex flex-col items-center pt-6">
		{#if state === 'prompt'}
			<div class="title">You need to be signed in to <br /> perform this action</div>
			<Button gradient class="rounded-full mt-8 mx-auto block" on:click={onSignIn}>Sign In</Button>
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
			<Button gradient rounded on:click={closePopup} class="mt-6">Continue</Button>
		{/if}

		{#if state === 'error'}
			<div class="title">Sign this message</div>
			<div class="text-sm mt-8 font-bold">Signing Failed!</div>
			<div class="mt-6 gap-x-8 flex scale-75">
				<Button variant="rounded-outline" rounded on:click={closePopup}>Cancel</Button>
				<Button gradient rounded on:click={onSignIn}>Try again</Button>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
