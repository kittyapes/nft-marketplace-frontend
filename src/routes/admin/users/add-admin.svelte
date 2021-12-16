<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import VerificationQueueSection from '$lib/sections/admin/VerificationQueueSection.svelte';
	import VerifiedCreatorsSection from '$lib/sections/admin/VerifiedCreatorsSection.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Back from '$icons/back_.svelte';
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row overflow-x-hidden">
	<AdminSidebar />

	<!-- Page Content -->
	<div class="w-2/3 px-20 py-16 overflow-x-auto">
		<div class="text-4xl uppercase font-bold">User management</div>

		<a class="mt-12 flex gap-4 items-center text-lg" href="/admin/users">
			<Back />
			BACK
		</a>

		<!-- Add verified Creator -->
		<div class="uppercase text-lg font-bold mt-14">Add Administrator</div>

		<Separator class="mt-5 mb-10" />

		<div class="flex flex-col">
			<div class="text-xs font-bold uppercase mb-2">Creator Username</div>
			<TextInput grayOutline placeholder="newadmin" class="w-96 h-14" />

			<div class="text-xs font-bold uppercase mt-9 mb-2">Address</div>
			<TextInput grayOutline placeholder="0x..." class="w-96 h-14" />

			<div class="text-xs font-bold uppercase mt-9 mb-2">Admin Type</div>
			<select class="w-96 border h-10 rounded-md">
				<option>Super Admin</option>
				<option>???</option>
			</select>

			<div class="text-xs font-bold uppercase mt-9">permissions</div>
			<div class=" max-w-sm grid grid-cols-2 grid-rows-3 gap-4 mt-8">
				<Checkbox label="Add Accounts" />
				<Checkbox label="Remove Accounts" />
				<Checkbox label="Ban Accounts" />
				<Checkbox label="Mint NFT's" />
				<Checkbox class="col-span-2" label="Verify Creators" />
			</div>

			<Button variant="rounded-black" class=" mt-16" stretch>Save Changes</Button>
		</div>
	</div>
</div>
