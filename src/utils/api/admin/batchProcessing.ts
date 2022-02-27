import { api } from '$constants/api';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';

export function forceBatchProcess() {
	axios
		.post(api + '/v1/settings/processJob')
		.then(() => notifySuccess('Batch processed.'))
		.catch((e) => notifyError(e.message));
}
