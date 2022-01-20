export const initializeMoralis = () => {
	(window as any).Moralis.initialize(import.meta.env.VITE_MORALIS_APP_ID);
	(window as any).Moralis.start({
		appId: import.meta.env.VITE_MORALIS_APP_ID,
		serverUrl: import.meta.env.VITE_MORALIS_SERVER_URL
	});

	return (window as any).Moralis;
};

export const getMoralis = () => {
	if ((window as any).Moralis.isInitialized) {
		return (window as any).Moralis;
	} else {
		return initializeMoralis();
	}
};
