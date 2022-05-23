<script>
	import { page } from '$app/stores';
	import { currentUserAddress } from '$stores/wallet';

	import { getApiUrl } from '$utils/api';
	import { getAxiosConfig } from '$utils/auth/axiosConfig';

	import axios from 'axios';

	let data;

	async function fetchCollectionData() {
		data = await axios.get(getApiUrl('v2', 'collections/' + $page.params.collectionId), getAxiosConfig());
	}

	$: $currentUserAddress && fetchCollectionData();
</script>

<pre>
    {$page.params.collectionId}
    {JSON.stringify(data, null, 2)}
</pre>
