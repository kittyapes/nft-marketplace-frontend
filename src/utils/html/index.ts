import DOMPurify from 'dompurify';

export function makeLink(text: string, url: string) {
	return `<a href="${url}" target="_blank">${text}</a>`;
}

export function makeBold(text: string) {
	return `<b>${text}</b>`;
}

export function sanitizeHtmlInternal(text: string) {
	return DOMPurify.sanitize(text);
}
