import dayjs from 'dayjs';

/**
 * Formats a datetime string to a human readable format. Use for consistency across the app.
 * @param isoString A datetime string in a format that will fit into dayjs.
 * @returns A datetime string in a format that can be used in the UI.
 */
export function formatDatetimeFromISO(isoString: string | dayjs.Dayjs) {
	try {
		return dayjs(isoString).format('MMM DD, YYYY hh:mm A');
	} catch {
		return 'N/A';
	}
}
