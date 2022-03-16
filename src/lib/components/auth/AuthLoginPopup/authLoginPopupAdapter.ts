export type AuthLoginPopupState = 'prompt' | 'loading' | 'confirm' | 'success' | 'error';

export interface AuthLoginPopupAdapter {
	/**
	 * Get the prompt to display to the user.
	 */
	getPrompt: () => {
		title: string;
	};

	/**
	 * Get the message that will need to be signed by the user in order to login.
	 */
	getMessageToSign: (address: string) => Promise<string | null>;

	/**
	 * Get the signature and request the server to verify the signature. The function must return a token
	 * which will then be used to login the user in the `useToken` function.
	 */
	getAuthToken: (address: string, signature: string) => Promise<string | null>;

	/**
	 * Login the user with the token returned by `getAuthToken`.
	 */
	useToken: (address: string, token: string) => void;
}
