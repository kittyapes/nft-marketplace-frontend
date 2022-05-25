export interface NFTCreationObject {
	contractId: number;
	amount: number;
	name: string;
	creator: string;
	image: Blob;
	animation: Blob;
	description?: string;
}
