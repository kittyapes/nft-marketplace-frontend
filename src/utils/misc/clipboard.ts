import { notifyError, notifySuccess } from '$utils/toast';

export function copyUrlToClipboard() {
	try {
		navigator.clipboard.writeText(window.location.href);
		notifySuccess(`Successfully copied URL to clipboard`);
	} catch (err) {
		notifyError('Failed to copy URL to clipboard');
	}
}
