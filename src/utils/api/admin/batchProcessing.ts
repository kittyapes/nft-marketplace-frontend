import { api } from '$constants/api';
import axios from 'axios';

export async function forceBatchProcess() {
	return await axios.post(api + '/v1/settings/processJob');
}

export interface BatchProcessingSettings {
	enabled: boolean;
	processingDayIndex: number;
}

export async function putBatchProcessSettings(options: BatchProcessingSettings) {
	console.log(options);

	return await axios.put(api + '/v1/settings/job');
}

export async function getBatchProcessSettings() {
	return { enabled: true, processingDayIndex: 3 } as BatchProcessingSettings;
}
