export interface NftDraft {
	thumbnailBlob: Blob;
	assetBlob: Blob;
	assetPreview: string;
	thumbnailPreview: string;
	description: string;
	name: string;
	collectionAddress: string;
	quantity: number;
}
