throw new Error('@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)');

// Returns an empty list of nfts for the marketplace
export const get = () => {
	return {
		body: {
			nfts: [],
		},
	};
};
