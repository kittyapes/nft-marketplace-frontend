<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import AdminVerificationQueueSection from '$lib/sections/AdminVerificationQueueSection.svelte';
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row">
	<AdminSidebar />

	<!-- Page Content -->
	<div class="px-20 py-16 w-full">
		<div class="text-4xl uppercase font-bold">User management</div>

		<!-- Add verified Creator -->
		<div class="uppercase text-lg font-bold mt-12">Add Verified Creator</div>

		<div class="mt-7 flex gap">
			<TextInput
				grayOutline
				placeholder="Enter an address to add to the Verified Creators..."
				class="w-96 h-14"
			/>

			<Button variant="rounded-outline" class="ml-7 text-xs">add to queue</Button>
		</div>

		<div class="w-full flex items-center mt-12 justify-between">
			<div class="flex items-center gap-3">
				Automatic Batch Processing
				<Checkbox />

				<div class="">
					<Button variant="rounded-outline" class="ml-7 text-xs" stretch>
						Force processing now
					</Button>
				</div>
			</div>

			<div>
				<span class="pr-4">Sort By</span>
				<select class="border h-10 rounded-md">
					<option>Date</option>
					<option>Alphabetical</option>
				</select>
			</div>
		</div>

		<!-- Verification Queue -->
		<AdminVerificationQueueSection />
	</div>
</div>
