import { toast } from '@zerodevx/svelte-toast';
import type { AxiosError } from 'axios';
import InnerToast from '$lib/components/toast/InnerToast.svelte';
import SuccessCheck from '$icons/success-check.svelte';
import ErrorCross from '$icons/error-cross.svelte';
import InfoV2 from '$icons/info-v2.svelte';

export const notifySuccess = (message: string, subMessage?: string) =>
	toast.push(message, {
		dismissable: false,
		theme: {
			'--toastBackground': 'linear-gradient(90deg, rgba(100, 180, 0, 1), rgba(50, 200, 0, 1), rgba(50, 180, 100, 1))',
			'--toastColor': 'white',
			'--toastBarBackground': 'transparent',
			'--toastWidth': '24rem',
		},
		component: {
			src: InnerToast,
			props: {
				message: message,
				subMessage: subMessage,
				icon: {
					src: SuccessCheck,
					props: {
						gradient: false,
					},
				},
			},
		},
	});

export const notifyWarning = (message: string, subMessage?: string) =>
	toast.push(message, {
		dismissable: false,
		theme: {
			'--toastBackground': 'linear-gradient(90deg, #A794FF, #67D4F8)',
			'--toastColor': 'white',
			'--toastBarBackground': 'transparent',
			'--toastWidth': '24rem',
		},
		component: {
			src: InnerToast,
			props: {
				message: message,
				subMessage: subMessage,
				icon: {
					src: InfoV2,
					props: {
						gradient: false,
					},
				},
			},
		},
	});

export const notifyError = (message: string, subMessage?: string) =>
	toast.push(message, {
		dismissable: false,
		theme: {
			'--toastBackground': 'linear-gradient(90deg, #FF297C 0%, #F21E91 50%, #FC0363 100%)',
			'--toastColor': 'white',
			'--toastBarBackground': 'transparent',
			'--toastWidth': '24rem',
		},
		component: {
			src: InnerToast,
			props: {
				message: message,
				subMessage: subMessage,
				icon: {
					src: ErrorCross,
					props: {
						gradient: false,
					},
				},
			},
		},
	});

/**
 * A function meant to be put inside a .catch. Creates a toast notification with the error code
 * and error. Logs the error to the console and returns null.
 * @param e AxiosError
 * @returns null
 */
export function httpErrorHandler(e: AxiosError) {
	const toastText = `Code: ${e.response?.status || 'N/A'} - ${e.response?.statusText || 'N/A'}, ${e.response?.data?.message || 'N/A'}`;

	notifyError(toastText);

	console.error(e);

	return null;
}

export const makeSuccessHandler = (message: string) => () => notifySuccess(message);
export const makeErrorHandler = (message: string) => (e) => {
	notifyError(message);
	console.error(e.message);
};
