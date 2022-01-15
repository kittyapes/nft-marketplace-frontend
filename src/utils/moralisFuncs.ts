export const initializeMoralis = () => {
	(window as any).Moralis.initialize('cCiAcKPjQTry1uKou6Y8G84Zk8ZD2rz9ArOTEkGL');
	(window as any).Moralis.start({
		appId: 'cCiAcKPjQTry1uKou6Y8G84Zk8ZD2rz9ArOTEkGL',
		serverUrl: 'https://f7ezk8y7qibj.usemoralis.com:2053/server'
	});

	console.log((window as any).Moralis);

	return (window as any).Moralis;
};

export const getMoralis = () => {
	if ((window as any).Moralis.isInitialized) {
		return (window as any).Moralis;
	} else {
		return initializeMoralis();
	}
};
