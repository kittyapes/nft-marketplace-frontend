import dayjs from 'dayjs';

export function formatDatetimeFromISO(isoString: string) {
	try {
		return dayjs(isoString).format('MMM DD, YYYY hh:mm A');
	} catch {
		return 'N/A';
	}
}
