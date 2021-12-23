import { toast } from '@zerodevx/svelte-toast';

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
