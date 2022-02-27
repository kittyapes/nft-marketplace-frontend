import { api } from '$constants/api';
import axios from 'axios';

export async function forceBatchProcess() {
	return await axios.post(api + '/v1/settings/processJob');
}
