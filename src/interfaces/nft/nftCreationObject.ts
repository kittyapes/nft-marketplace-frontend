export interface NFTCreationObject {
	amount: number;
	name: string;
	creator: string;
	thumbnail: Blob;
	asset: Blob;
	description?: string;
	collectionAddress: string;
}
