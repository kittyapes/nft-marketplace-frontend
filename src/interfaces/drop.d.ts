interface DropPostObject {
	contractId: number;
	title: string;
	artist: string;
	creator: string;
	description: string;
}

interface DropApiReturnValue {
	artist: string;
	contractId: string;
	coverUrl: string;
	createdAt: string; // Date string
	creator: string; // address
	description: string;
	imageUrl: string;
	title: string;
	updatedAt: string; // Date string
	_id: string; //"622b5edab88c6c7b95fd6c6b"
}
