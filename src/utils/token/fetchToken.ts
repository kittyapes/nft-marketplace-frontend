export async function fetchTokenData(url: string) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data as TokenData;
	} catch (error) {
		console.log(url);
		throw new Error('Failed to process request');
	}
}
