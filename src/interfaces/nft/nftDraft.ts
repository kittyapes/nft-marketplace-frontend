export interface NftDraft {
	thumbnailBlob: Blob;
    assetBlob: Blob;
    assetPreview: string;
    thumbnailPreview: string;
    description: string;
	name: string;
	collectionName: string;
    quantity: number;
}
