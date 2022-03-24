export interface NFTCreationObject {
	dropId: number;
	contractId: number;
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
