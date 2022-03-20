import { api } from '$constants/api';
import axios from 'axios';

const checkIdAvailability = async (id: number) => {
	if (typeof id === 'number') {
		try {
			const _data = await axios.get(`${api}/v1/nfts/${id}`);
			return false;
		} catch (_err) {
			return true;
		}
	} else {
		return true;
	}
};

const generateNftID: () => Promise<string> = async () => {
	let randomNum = Math.floor(1000 + Math.random() * 7000000);
	if (await checkIdAvailability(randomNum)) {
		return randomNum.toString();
	} else {
		return await generateNftID();
	}
};

export default generateNftID;
