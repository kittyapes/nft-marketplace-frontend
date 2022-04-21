<script lang="ts">
	import { selectedCard } from '$stores/marketplace';

	import type { TokenData } from 'src/interfaces/tokenData';
	import InfoTab from '../marketplace/UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../marketplace/UniversalPopup/PopupContainer.svelte';

	export let data: TokenData;

	selectedCard.set({ ...data.metadata });

	let infoData = {
		creator: data.metadata.artist,
		edition: data.metadata.id && data.metadata.supply ? `${data.metadata.id} of ${data.metadata.supply}` : '',
		editionType: data.metadata.categories,
		//externalLink: data.metadata.external_link,
		description: data.metadata.description
	};

	console.log(data);
</script>

<PopupContainer>
	<div slot="content" class="flex-grow flex flex-col">
		<InfoTab data={infoData} />
		<button class="btn btn-rounded btn-black uppercase text-sm font-normal mt-auto w-full mb-5 self-center">make an offer</button>
	</div>
</PopupContainer>
