<script lang="ts">
	import EthV2 from '$icons/eth-v2.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import EthAddress from './EthAddress.svelte';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';

	export let creatorData: {
		name: string;
		address: string;
		coverImg: string;
		profileImg: string;
		created: number;
	};
</script>

<div class="w-full flex flex-col">
	<div class="w-full bg-dark-gradient h-[400px]">
		<img src={creatorData.coverImg} alt="Featured creator cover." class="h-full object-cover w-full " />
	</div>

	<div class="bg-dark-gradient flex flex-col items-center justify-center flex-grow">
		<div class="w-full flex justify-between px-4">
			<div class="flex gap-4">
				<div class="w-24 h-24">
					<img src={creatorData.profileImg} alt="Featured crator profile." class="h-full object-cover object-top w-full" />
				</div>
				<div class="flex flex-col justify-between">
					<div class="flex gap-2 items-center ">
						<div class="text-4xl text-white whitespace-nowrap truncate">{creatorData.name}</div>
						<VerifiedBadge />
					</div>
					<div class="bg-card-gradient p-1 flex items-center gap-2 w-fit">
						<EthV2 />
						<EthAddress address={creatorData.address} concat class="!text-white" />
					</div>
				</div>
			</div>
			<div class="flex flex-col justify-between items-end">
				<PrimaryButton class="w-40">Follow</PrimaryButton>
				<div class="text-xl">Created {creatorData.created}</div>
			</div>
		</div>
	</div>
</div>
