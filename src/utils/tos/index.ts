import { goto } from '$app/navigation';
import { page } from '$app/stores';
import TosAcceptPopup from '$lib/components/popups/TosAcceptPopup.svelte';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { apiAgreeToTos, apiIsAgreedToLatestTos, type TosAgreeObject } from '$utils/api/tos';
import { getAuthTokenAsync } from '$utils/auth/token';
import { decodeJwt } from '$utils/jwt';
import { closePopup, setPopup } from '$utils/popup';
import { notifyError } from '$utils/toast';
// import { displayErrorOverlay } from '$lib/components/ErrorOverlay/ErrorOverlay';
import { get } from 'svelte/store';

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

const onCloseTosPopup = () => {
	confirmUserHasAgreedToLatestTos()
		.then((userAgreementObj) => {
			if ((userAgreementObj as { error: string }).error) {
				notifyError((userAgreementObj as { error: string }).error);
				return;
			}

			if (!(userAgreementObj as TosAgreeObject).hasAgreed) {
				notifyError('You have not agreed to the most recent version of the ToS as such Your usage of the site will be limited');
				goto('/');
				return;
			}
		})
		.catch((error) => {
			console.log(error);
			notifyError('Something broke, please try again.');
			return;
		});

	return;
};

async function ensureTosAccepted() {
	const authToken = await getAuthTokenAsync(get(currentUserAddress));
	const decodedToken = decodeJwt(authToken);

	if (decodedToken.tos) {
		// ToS Results are available so we need to check them
		/* The tos version here should always be the most recent version, however, when the token has expired,
		 * this might not be the case. As such, there's the chance that we might need to add another check for
		 * whether the version numbers match
		 */
		if (decodedToken.tos.hasAgreed) {
			// User can continue using the site
			return;
		} else {
			// Ensure the user does not need to agree constantly - once they agreed the first time
			const userAgreementObj = await confirmUserHasAgreedToLatestTos();

			if ((userAgreementObj as { error: string }).error) {
				notifyError((userAgreementObj as { error: string }).error);
				return { error: (userAgreementObj as { error: string }).error };
			}

			if (!(userAgreementObj as TosAgreeObject).hasAgreed) {
				setPopup(TosAcceptPopup, {
					closeByOutsideClick: true,
					unique: true,
					id: 'tos-accept-popup',
					onClose: onCloseTosPopup,
				});
			}

			return;
		}
	} else {
		// No ToS is available
		const userAgreementObj = await confirmUserHasAgreedToLatestTos();

		if ((userAgreementObj as { error: string }).error) {
			console.log('No T available', (userAgreementObj as { error: string }).error);
			return;
		}

		if (!(userAgreementObj as TosAgreeObject).hasAgreed) {
			setPopup(TosAcceptPopup, {
				closeByOutsideClick: true,
				unique: true,
				id: 'tos-accept-popup',
				onClose: onCloseTosPopup,
			});
			return;
		}

		return;
	}
}

export async function confirmUserHasAgreedToLatestTos() {
	const userHasAgreedToLatest = await apiIsAgreedToLatestTos();
	console.log(userHasAgreedToLatest);

	if (userHasAgreedToLatest.errData) {
		if (userHasAgreedToLatest.errData.statusCode === 404) {
			// No ToS Version Present
			console.error('Latest TOS version data not available.');
			const error = 'Something broke, please try again.';

			return { error };
		}

		const error = 'Something broke, please try again.';

		return { error };
	}

	return userHasAgreedToLatest.data.data;
}

export async function handleAgreeToTos() {
	// Check if user has agreed to latest
	const userAgreementObj = await confirmUserHasAgreedToLatestTos();

	if ((userAgreementObj as { error: string }).error) {
		notifyError((userAgreementObj as { error: string }).error);
		return { error: (userAgreementObj as { error: string }).error };
	}

	const versionHash = (userAgreementObj as TosAgreeObject).version_hash;
	const versionLabel = (userAgreementObj as TosAgreeObject).version;

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
