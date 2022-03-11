import { browser } from '$app/env';
import { get, writable } from 'svelte/store';

export interface PopupOptions {
	id?: string;
	unique?: boolean;
	props?: {
		[key: string]: any;
	};
	onClose?: () => boolean | void;
}

export interface PopupStackItem {
	id: string;
	component: any;
	options: PopupOptions;
	handler: PopupHandler;
}

export interface PopupHandler {
	id: string;
	close: () => void;
}

const defaultOptions: PopupOptions = {};

export const popupStack = writable<PopupStackItem[]>([]);

export function setPopup(component: any, options: PopupOptions = defaultOptions) {
	if (!browser) {
		return;
	}

	// Ignore duplicate popups that should be unique
	if (options.unique && existsInstanceOfPopup(component)) {
		return;
	}

	// Generate a random ID if one was not provided, that will be used to identify the popup
	// during various operations, like closing it, etc.
	const id = options.id || Math.random().toString(36).substring(2, 9);

	// A handler object that will be returned to control the popup
	const handler: PopupHandler = {
		id,
		close: () => {
			const canBeClosed = options.onClose ? options.onClose() : true;

			console.log({ canBeClosed });

			if (canBeClosed) {
				popupStack.update((stack) => {
					return stack.filter((item) => item.id !== id);
				});
			}
		}
	};

	// Add the popup to the end of the stack. The last popup
	// will always be rendered.
	popupStack.update((stack) => {
		return [...stack, { id, component, options, handler }];
	});

	return handler;
}

export function existsInstanceOfPopup(component: any) {
	return get(popupStack).some((item) => item.component === component);
}
