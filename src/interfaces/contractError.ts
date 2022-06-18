export interface ContractError extends Error {
	code: string;
	error: {
		code: number;
		data: {
			originalError: {
				code: number;
				data: string;
				message: string;
			};
		};

		// This is the most useful message, .error.message
		message: string;
	};
	method: string;
	reason: string;
	transaction: {
		accessList: any;
		data: string;
		from: string;
		to: string;
	};
	message: string;
	stack: string;
}
