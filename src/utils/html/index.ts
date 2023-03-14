import { browser } from '$app/environment';
import DOMPurify from 'dompurify';

export function makeLink(text: string, url: string) {
	return `<a href="${url}" target="_blank">${text}</a>`;
}

export function makeBold(text: string) {
	return `<b>${text}</b>`;
}

export function sanitizeHtmlInternal(text: string) {
	if (!browser) return;

	const domPurify = DOMPurify(window);
	return domPurify.sanitize(text);
}
