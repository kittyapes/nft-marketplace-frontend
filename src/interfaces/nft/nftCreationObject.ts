export interface NFTCreationObject {
	amount: number;
	name: string;
	creator: string;
	image: Blob;
	animation: Blob;
	description?: string;
	collectionId: string;
}
