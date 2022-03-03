import { toast } from '@zerodevx/svelte-toast';
import type { AxiosError } from 'axios';

export const notifySuccess = (message: string) =>
	toast.push(message, {
		theme: {
			'--toastBackground': 'linear-gradient(to right, rgb(134, 139, 247), rgb(108, 199, 248))',
			'--toastColor': 'white',
			'--toastBarBackground': '#1E3A8A'
		}
	});

export const notifyWarning = (message: string) =>
	toast.push(message, {
		theme: {
			'--toastBackground': '#fb923c',
			'--toastColor': 'white',
			'--toastBarBackground': '#f97316'
		}
	});

export const notifyError = (message: string) =>
	toast.push(message, {
		theme: {
			'--toastBackground': '#f87171',
			'--toastColor': 'white',
			'--toastBarBackground': '#ef4444'
		}
	});

export function httpErrorHandler(e: AxiosError) {
	const toastText = `Code: ${e.response?.status || 'N/A'} - ${e.response?.statusText || 'N/A'}, ${
		e.response?.data?.message || 'N/A'
	}`;

	notifyError(toastText);

	console.error(e);
}

export const makeSuccessHandler = (message: string) => () => notifySuccess(message);
export const makeErrorHandler = (message: string) => (e) => {
	notifyError(message);
	console.error(e.message);
};
