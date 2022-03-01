import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '..';

export async function forceBatchProcess() {
	return await axios.post(api + '/v1/settings/processJob', {}, getAxiosConfig());
}

export interface BatchProcessingSettings {
	enabled: boolean;
	processingDayIndex: number;
}

export async function putBatchProcessSettings(options: BatchProcessingSettings) {
	console.log('Putting new config');
	console.log(options);

	return await axios.put(
		api + '/v1/settings/job',
		{ isEnableProcessingJob: options.enabled },
		getAxiosConfig()
	);
}

export async function getBatchProcessSettings() {
	const res = await axios.get(api + '/v1/settings/job', getAxiosConfig());
	const info = res.data.data.info;

	return { enabled: info.isEnableProcessingJob, processingDayIndex: 3 } as BatchProcessingSettings;
}
