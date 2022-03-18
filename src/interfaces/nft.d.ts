interface NFTCreationObject {
	dropId: string;
	contractId: string;
	amount: string;
	name: string;
	generation: string;
	categories: string;
	tag: string;
	artist: string;
	creator: string;
	image: Blob;
	animation: Blob;
}

interface NFTApiReturnValue {}

interface NFTMintingObject {
	dropId: string;
	id: string;
	amount: string;
}
