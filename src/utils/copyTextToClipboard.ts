import { notifyError, notifySuccess } from './toast';

export default (text: string) => {
	try {
		navigator.clipboard.writeText(text);
		notifySuccess(`Successfully copied text to clipboard`);
	} catch (err) {
		notifyError('Failed to copy text to clipboard');
	}
};
