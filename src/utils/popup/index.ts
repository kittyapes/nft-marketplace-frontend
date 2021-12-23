import { writable } from 'svelte/store';

export interface PopupOptions {
	props: {
		[key: string]: any;
	};
}

const defaultOptions: PopupOptions = {
	props: {}
};

export const popupComponent = writable(null);
export const popupOptions = writable<PopupOptions>(null);

export function setPopup(component: any, options: PopupOptions = defaultOptions) {
	popupComponent.set(component);
	popupOptions.set(options);
}

export function closePopup() {
	popupComponent.set(null);
}
