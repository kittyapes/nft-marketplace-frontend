import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '..';

export async function forceBatchProcess() {
	return await axios.post(getApiUrl('latest', 'settings/processJob'), {}, getAxiosConfig());
	
}

export interface BatchProcessingSettings {
	enabled: boolean;
	processingDayIndex: number;
}

export async function putBatchProcessSettings(options: BatchProcessingSettings) {
	const cronString = `0 0 * * ${options.processingDayIndex + 1}`;

	return await axios.put(
		getApiUrl('latest', 'settings/job'),
		{ isEnableProcessingJob: options.enabled, intervalTime: cronString },
		getAxiosConfig()
	);
}

export async function getBatchProcessSettings() {
	const res = await axios.get(getApiUrl('latest', 'settings/job'), getAxiosConfig());
	const info = res.data.data.info;

	const dayIndex = parseInt(info.intervalTime.split(' ')[4]) - 1;

	return {
		enabled: info.isEnableProcessingJob,
		processingDayIndex: dayIndex
	} as BatchProcessingSettings;
}
