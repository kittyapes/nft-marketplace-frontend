import hasha from 'hasha';

export const generateDropCreationSignMessage = (
	dropId: string,
	contractId: number,
	name: string,
	amount: string,
	generation: string,
	categories: string,
	artist: string,
	creator: string,
	imageOne: string,
	imageTwo: string
) => {
	const hashedImage = hasha(imageOne).substring(0, 8) + hasha(imageTwo).substring(0, 8);

	return hasha(
		dropId + contractId + name + amount + generation + categories + artist + creator + hashedImage
	);
};
