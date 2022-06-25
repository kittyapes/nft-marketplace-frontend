	import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import type { UserRole } from 'src/interfaces/userData';
import { getApiUrl } from '.';
import { forceBatchProcess } from './admin/batchProcessing';
import { postInactivationQueueAdd } from './admin/userManagement';

export async function addUserRole(address: string, roles: UserRole[]) {

	// 🔥 fix
	if(roles.includes('inactivated_user')) {
		roles = roles.filter(e => e !== 'inactivated_user')
		const res = await postInactivationQueueAdd(address).catch(httpErrorHandler);

		if (res?.status !== 200) {
			throw new Error(res?.data.message);
		}		

		await forceBatchProcess().catch(httpErrorHandler);
	}

	const res = await axios
		.put(
			getApiUrl('latest', 'admins/' + address),
			{
				roles,
			},
			getAxiosConfig()
		)
		.catch(() => null);

	if (res?.status !== 200) {
		throw new Error(res?.data.message);
	}

	return res.data.data;
}
