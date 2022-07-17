import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '..';

export async function forceBatchProcess() {
	const res = await axios.post(getApiUrl('latest', 'settings/processJob'), {}, await getAxiosConfig());
	return res;
}

export interface BatchProcessingSettings {
	enabled: boolean;
	processingDayIndex: number;
}

export async function putBatchProcessSettings(options: BatchProcessingSettings) {
	const cronString = `0 0 * * ${options.processingDayIndex + 1}`;

	return await axios.put(getApiUrl('v2', 'settings/job'), { isEnableProcessingJob: options.enabled === null ? false : options.enabled, intervalTime: cronString }, await getAxiosConfig());
}

export async function getBatchProcessSettings() {
	const res = await axios.get(getApiUrl('v2', 'settings/job'), await getAxiosConfig());
	const info = res.data.data.info;

	const dayIndex = parseInt(info.intervalTime.split(' ')[4]) - 1;

	if (dayIndex.toString() === 'NaN') {
		throw new Error('Cannot parse batch processing day!');
	}

	return {
		enabled: info.isEnableProcessingJob,
		processingDayIndex: dayIndex
	} as BatchProcessingSettings;
}
