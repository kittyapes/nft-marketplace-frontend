export interface Position {
	endTime: number; // milliseconds since epoch
	stakeTime: number; // milliseconds since epoch
	amount: string;
	aprOrApy: number;
	interestType: 'apy' | 'apr';
	unstakeAvailable: boolean;
	stakeId: number;
}

export interface Reward {
	token: string;
	amount: string;
	APY: string;
}
