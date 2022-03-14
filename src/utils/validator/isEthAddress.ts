export const ethAddressRegex = '^0x[a-fA-F0-9]{40}$';

export function isEthAddress(s: string) {
	if (!s) return false;

	return RegExp(ethAddressRegex).test(s);
}
