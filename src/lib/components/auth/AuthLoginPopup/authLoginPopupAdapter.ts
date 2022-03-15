export type AuthLoginPopupState = 'prompt' | 'loading' | 'confirm' | 'success' | 'error';

export interface AuthLoginPopupAdapter {
	getPrompt: () => {
		title: string;
	};
	getMessageToSign: (address: string) => Promise<string | null>;
	getAuthToken: (address: string, signature: string) => Promise<string | null>;
	useToken: (address: string, token: string) => void;
}
