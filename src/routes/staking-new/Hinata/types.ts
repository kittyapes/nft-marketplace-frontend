export interface Position {
	endTime: number;
	amount: number;
	aprOrApy: number;
	interestType: 'apy' | 'apr';
	unstakeAvailable: boolean;
}

export interface Reward {
	token: string;
	amount: string;
	APY: string;
}
