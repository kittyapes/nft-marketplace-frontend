import { setPopup } from '$utils/popup';
import ErrorOverlay from './ErrorOverlay.svelte';

export function displayErrorOverlay() {
	setPopup(ErrorOverlay, { closeByOutsideClick: false, unique: true });
}
