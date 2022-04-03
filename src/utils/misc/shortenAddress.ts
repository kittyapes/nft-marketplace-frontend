export function shortenAddress(address: string) {
	if (!address) return '';

	return address.substring(0, 3) + '...' + address.substring(address.length - 4);
}
