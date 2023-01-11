import { page } from '$app/stores';
import { displayErrorOverlay } from '$lib/components/ErrorOverlay/ErrorOverlay';
import TosAcceptPopup from '$lib/components/popups/TosAcceptPopup.svelte';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { apiAgreeToTos, apiGetLatestTosVersion, apiIsAgreedToTosVersion, type LatestVersionRes } from '$utils/api/tos';
import { closePopup, setPopup } from '$utils/popup';
import { notifyError } from '$utils/toast';
import { get, writable } from 'svelte/store';

const latestVersionResStore = writable<LatestVersionRes>();

const whitelistedPaths = ['/terms-and-conditions'];

export function initTos() {
	const checkPathAndAddress = () => {
		const page_ = get(page);
		const path = page_.url.pathname;

		// Close ToS popup if the user has moved to a whitelisted path
		if (whitelistedPaths.includes(path)) {
			closePopup('tos-accept-popup');
			return;
		}

		// If the wallet is disconnected, return, else show ToS popup
		const address = get(currentUserAddress);

		if (!address) {
			return;
		}

		ensureTosAccepted();
	};

	page.subscribe(checkPathAndAddress);
	currentUserAddress.subscribe(checkPathAndAddress);
}

async function ensureTosAccepted() {
	const latestVersionRes = await apiGetLatestTosVersion();

	const error = () => {
		console.error('Getting the latest ToS version label resulted in an error. The user should not be allowed to continue using the site.');
		notifyError('Failed to get latest ToS version info: ' + (latestVersionRes as any).message || 'N/A');
	};

	if (latestVersionRes.err || !latestVersionRes.data) {
		error();
		return;
	}

	latestVersionResStore.set(latestVersionRes.data as LatestVersionRes);

	const latestVersionLabel = latestVersionRes.data.data.version;

	// If we do not get the latest version label, we need to error out
	if (!latestVersionLabel) {
		error();
		return;
	}

	const isAgreedRes = await apiIsAgreedToTosVersion(latestVersionLabel);

	// The user has already agreed to the latest version
	if (isAgreedRes?.data?.data === latestVersionLabel) {
		return;
	}

	// The API throws a 404 if the user didn't agree to the ToS yet. Dunno why, but we have to handle it.
	if (isAgreedRes.errData?.message.includes('Has not agreed to TOS')) {
		setPopup(TosAcceptPopup, { closeByOutsideClick: false, unique: true, id: 'tos-accept-popup' });
		return;
	}

	// If we reached the end of the function, something has gone wrong
	// and the user should not be able to continue using the site
	console.error('Could not tell if user has agreed to the latest version of ToS. The user should not be able to continue using the site.');
	// TODO - Reactivate when the TOS is fixed
	// displayErrorOverlay();
}

export async function handleAgreeToTos() {
	const latestVersionRes = get(latestVersionResStore);

	if (!latestVersionRes) {
		console.error('Latest TOS version data not available.');

		const error = 'Something broke, please try again.';
		notifyError(error);

		return { error };
	}

	const versionHash = latestVersionRes.data.version_hash;
	const versionLabel = latestVersionRes.data.version;

	let signature: string;

	try {
		signature = await get(appSigner).signMessage(versionHash);
	} catch (err) {
		console.error(err);

		const error = 'Failed to get ToS version signature from the wallet.';
		notifyError(error);

		return { error };
	}

	const agreeToTosRes = await apiAgreeToTos(versionLabel, signature);

	if (agreeToTosRes.err || !agreeToTosRes.data) {
		const error = 'Failed to post ToS agreement signature to the server.';
		notifyError(error);

		return { error };
	}

	return { error: false };
}
