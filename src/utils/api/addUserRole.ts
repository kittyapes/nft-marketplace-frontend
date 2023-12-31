import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler, notifyError } from '$utils/toast';
import axios from 'axios';
import type { UserRole } from 'src/interfaces/userData';
import { getApiUrl } from '.';
import { forceBatchProcess } from './admin/batchProcessing';
import { postInactivationQueueAdd, postVerificationQueueAdd } from './admin/userManagement';

export async function addUserRole(address: string, roles: UserRole[], roleToAdd: UserRole) {
	if (roleToAdd === 'inactivated_user') {
		const res = await postInactivationQueueAdd(address).catch(httpErrorHandler);

		if (res?.status !== 200) {
			notifyError(res.data.message);
		}

		await forceBatchProcess().catch(httpErrorHandler);
	} else if (roleToAdd === 'verified_user') {
		const res = await postVerificationQueueAdd(address).catch(httpErrorHandler);

		if (res?.status !== 200) {
			notifyError(res.data.message);
		}

		await forceBatchProcess().catch(httpErrorHandler);
	}

	const res = await axios
		.put(
			getApiUrl('latest', 'admins/' + address),
			{
				roles,
			},
			await getAxiosConfig(),
		)
		.catch(() => null);

	if (res?.status !== 200) {
		throw new Error(res?.data.message);
	}

	return res.data.data;
}
