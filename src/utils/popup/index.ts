import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

export interface PopupOptions {
	id?: string;
	unique?: boolean;
	closeByOutsideClick?: boolean;
	props?: {
		[key: string]: any;
	};
	onClose?: () => boolean | void;
	// implicitly defaulted to false
	returnPromise?: boolean;
}

export interface PopupStackItem {
	id: string;
	component: any;
	options: PopupOptions;
	handler: PopupHandler;
}

export interface PopupHandler {
	id: string;
	closePromise: {
		promise: Promise<any>;
		fulfilled: boolean;
	};
	close: () => void;
}

const defaultOptions: PopupOptions = {
	closeByOutsideClick: true,
};

export const popupStack = writable<PopupStackItem[]>([]);

export function updatePopupProps(id: string, props: { [key: string]: any }) {
	popupStack.update((stack) => {
		const item = stack.find((e) => e.id === id);
		if (item?.options) {
			item.options.props = props;
		}
		return stack;
	});
}

export function setPopup(component: any, options: PopupOptions = defaultOptions) {
	if (!browser) {
		return;
	}

	// Popuplate unset properties with default values
	options = {
		...defaultOptions,
		...options,
	};

	// Ignore duplicate popups that should be unique
	if (options.unique && existsInstanceOfPopup(component)) {
		return;
	}

	// Generate a random ID if one was not provided, that will be used to identify the popup
	// during various operations, like closing it, etc.
	const id = options.id || Math.random().toString(36).substring(2, 9);

	// A promise which resolves once the popup is closed
	let resolveClosePremise;
	const closePromise = {
		promise: new Promise((resolve, reject) => {
			resolveClosePremise = resolve;
		}),
		fulfilled: null,
	};

	// A handler object that will be returned to control the popup
	const handler: PopupHandler = {
		id,
		closePromise: options.returnPromise ? closePromise : undefined,
		close: () => {
			const canBeClosed = options.onClose ? options.onClose() !== false : true;

			if (canBeClosed) {
				popupStack.update((stack) => {
					return stack.filter((item) => item.id !== id);
				});
			}

			resolveClosePremise();
			closePromise.fulfilled = true;
		},
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

/**
 * Closes the popup with the given ID or the popup at the top of the stack.
 */
export function closePopup(id?: string) {
	if (id) {
		popupStack.update((stack) => {
			return stack.filter((item) => item.id !== id);
		});
	} else {
		popupStack.update((stack) => {
			return stack.slice(0, -1);
		});
	}
}
