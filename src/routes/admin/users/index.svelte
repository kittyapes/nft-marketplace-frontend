<script lang="ts">
	import VerificationQueueSection from '$lib/sections/admin/VerificationQueueSection.svelte';
	import VerifiedCreatorsSection from '$lib/sections/admin/VerifiedCreatorsSection.svelte';
	import AdministratorsSection from '$lib/sections/admin/AdministratorsSection.svelte';
</script>

<div class="flex flex-col w-full h-full min-h-screen overflow-x-hidden md:flex-row">
	<div class="w-full px-20 py-16 overflow-x-auto">
		<div class="text-4xl font-bold uppercase">User management</div>
		<VerificationQueueSection />
		<VerifiedCreatorsSection />
		<AdministratorsSection />
	</div>
</div>
