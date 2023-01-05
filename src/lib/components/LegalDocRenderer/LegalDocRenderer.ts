import axios from 'axios';

export interface LegalDocSection {
	title: string;
	markup: string;
}

export type LegalDocData = LegalDocSection[];

const BULLET_START = 'BULLET_START';
const BULLET_END = 'BULLET_END';

// Find bullet points in the format of (a)... - (z)... and surround
// them with BULLET_START and BULLET_END
function useBulletStartEnd(html: string) {
	const reListBullet = /\([a-z]\)[\s\S]*?(?=<)/g;

	// Find substrings with bullet points
	const bulletLines = [...html.matchAll(reListBullet)].map((v) => v[0]);

	if (bulletLines.length == 0) {
		return html;
	}

	for (const bulletLine of bulletLines) {
		// If bullet (a) line turns out to have (b) in it, skip it.
		const matches = [...bulletLine.matchAll(/\([a-z]\)/g)];

		if (matches.length > 1) {
			continue;
		}

		html = html.replace(bulletLine, BULLET_START + bulletLine + BULLET_END);
	}

	return html;
}

// Take parts of the section text starting with BULLET_START and ending with BULLET_END
// and convert them to <li> tags, surround them with the <ul> tag
function markupBulletLists(s: string) {
	const reListBullet = new RegExp(BULLET_START + '([\\s\\S]*?)' + BULLET_END, 'g');
	const bulletMatches = [...s.matchAll(reListBullet)];

	if (bulletMatches.length == 0) {
		return s;
	}

	// Insert <ul> around those lines. Has to be modified if we wanna support
	// multiple bullet point lists per section
	const startLine = bulletMatches[0][0];
	const endLine = bulletMatches[bulletMatches.length - 1][0];

	const blStartIndex = s.indexOf(startLine);
	const blEndIndex = s.indexOf(endLine) + endLine.length;

	s = [s.substring(0, blStartIndex), '<ul>', s.substring(blStartIndex, blEndIndex), '</ul>', s.substring(blEndIndex)].join('');

	bulletMatches.forEach((match) => {
		s = s.replace(match[0], `<li style="margin-left: 2rem;">${match[1]}</li>`);
	});

	return s;
}

const BOLD_START = 'BOLD_START';
const BOLD_END = 'BOLD_END';

function useBoldStartEnd(html: string) {
	return html.replace(/<b>/g, BOLD_START).replace(/<\/b>/g, BOLD_END);
}

function markupBold(s: string) {
	return s.replace(new RegExp(BOLD_START, 'g'), '<strong>').replace(new RegExp(BOLD_END, 'g'), '</strong>');
}

function parseLegalDocHtml(s: string): LegalDocData {
	// Remove tabs
	s = s.replace(/\t/g, '');

	const body = s.match(/<body[\s\S]*?>([\s\S]*)<\/body>/)[0];

	// Parse all section headings
	const headings = [...body.matchAll(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/g)].map((i) => {
		const elem = document.createElement('div');
		elem.innerHTML = i[1];

		return elem.innerText.trim();
	});

	// Because we are searching for section contents by getting the text
	// in between headings, we need to append a mock heading to the end
	// of the body to correctly retrieve the last section
	const appendedHeadingBody = body + '<h1>';

	// Parse all section contents
	const contents = [...appendedHeadingBody.matchAll(/<\/h1>([\s\S]*?)<h1.*?>/g)].map((match, index) => {
		let sectionContentHtml = match[1];

		// Remove some whitespace
		sectionContentHtml = sectionContentHtml.replace(/&nbsp;/g, '');

		// Surround bullet points with BULLET_START and BULLET_END
		sectionContentHtml = useBulletStartEnd(sectionContentHtml);

		// Do a similar thing for bold text
		sectionContentHtml = useBoldStartEnd(sectionContentHtml);

		// Create element and extract inner text from section. We remove useless HTML
		// elements that Word has exported
		const elem = document.createElement('div');

		elem.innerHTML = sectionContentHtml;

		let innerText = elem.innerText;

		// Convert surrounded bullet points to html <li>s, surround them with <ul>
		innerText = markupBulletLists(innerText);
		innerText = markupBold(innerText);
		innerText = innerText.trim();
		innerText = innerText.replace(/●/g, '');

		return innerText;
	});

	const output = [];

	// Create an object that can be interpreted by the LegalDocRenderer component
	headings.forEach((v, i) => {
		output.push({ title: v, markup: contents[i] });
	});

	return output;
}

// Prefix string with https if not already prefixed with http or https
function ensureHttp(s: string) {
	s = s.trim();

	if (s.startsWith('http://') || s.startsWith('https://')) {
		return s;
	}

	return 'https://' + s;
}

export async function getParsedLegalDoc(htmlUrl: string) {
	const html = (await axios.get(ensureHttp(htmlUrl))).data as string;

	return parseLegalDocHtml(html);
}
