export interface CollectionData {
    name: string;
    imageUrl: string;
    origin: 'EXTERNAL' | 'HINATA';
    verfified: boolean;
    floor: number;
    totalVolume: number;
    dailyVolume: number;
    dailyGrowth: number;
}