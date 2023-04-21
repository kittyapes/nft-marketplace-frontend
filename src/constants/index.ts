export const acceptedImages = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
export const acceptedVideos = [
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/gif',
	'video/mp4',
	'image/webp',
	'video/webm',
];
export const acceptedNftFileTypes = acceptedImages.concat(acceptedVideos);

export const walletConnectionRequiredRoutes = ['/create'];

export const defaultProfileImageUrl = '/svg/icons/guest-avatar.svg';
export const defaultOfferDuration = 3600 * 24 * 7; // seconds (one week)
