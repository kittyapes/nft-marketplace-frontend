import type { CardOptions } from '$interfaces/ui';
import { apiGetCollectionBySlug } from '$utils/api/collection';
import { addUrlParam } from '$utils/misc/addUrlParam';
import { removeUrlParam } from '$utils/misc/removeUrlParam';
import { setPopup, updatePopupProps } from '$utils/popup';
import CardPopup from './CardPopup.svelte';

/**
 * Open an instance of CardPopup based on the CardOptions provided. Item ID will be added
 * to the URL param `id`. This param will also be removed when the popup is closed. Complete
 * collection data will be fetched and will replace partial collection data. This fetch is asynchronous.
 */
export async function openCardPopupFromOptions(options: CardOptions) {
	let popupHandler;

	if (options.resourceType === 'nft') {
		popupHandler = setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('nftId') });
		addUrlParam('nftId', options.nfts[0].fullId);
	} else if (options.listingData.onChainId) {
		popupHandler = setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('listingId') });
		addUrlParam('listingId', options.listingData.onChainId);
	}

	// Load complete collection data after  opening the popup
	if (options.nfts[0].collectionData.slug) {
		const collectionData = await apiGetCollectionBySlug(options.nfts[0].collectionData.slug);

		// Replace partial collection data with complete collection data fetched from API
		if (collectionData) options.nfts[0].collectionData = collectionData;

		updatePopupProps(popupHandler?.id, { options });
	}
}
