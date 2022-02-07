<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import VerificationQueueSection from '$lib/sections/admin/VerificationQueueSection.svelte';
	import VerifiedCreatorsSection from '$lib/sections/admin/VerifiedCreatorsSection.svelte';
	import AdministratorsSection from '$lib/sections/admin/AdministratorsSection.svelte';
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row overflow-x-hidden">
	<AdminSidebar />

	<!-- Page Content -->
	<div class="px-20 py-16 w-full overflow-x-auto">
		<div class="text-4xl uppercase font-bold">User management</div>

		<!-- Add verified Creator -->
		<div class="uppercase text-lg font-bold mt-12">Add Verified Creator</div>

		<div class="mt-7 flex gap items-center">
			<input
				type="text"
				class="w-[500px] px-8 bg-[#F7F7F7] border border-[#CDCDCD] rounded-md placeholder-black font-light h-14 outline-none"
				placeholder="Enter an address to add to the Verified Creators..."
				autocomplete="nope"
			/>

			<button
				class="rounded-full border border-black uppercase px-10 whitespace-nowrap italic h-12 ml-8 transition-btn"
			>
				Add to queue
			</button>
		</div>

		<div class="w-full flex items-center mt-12 justify-between">
			<div class="flex items-center gap-3 flex-col lg:flex-row flex-wrap">
				<div class="flex items-center gap-3">
					Automatic Batch Processing
					<Checkbox />
				</div>

				<div>
					<span class="pr-1">Process Every</span>
					<select class="border h-10 rounded-md">
						<option>Monday</option>
						<option>Tuesday</option>
						<option>Wednesday</option>
						<option>Thursday</option>
						<option>Friday</option>
						<option>Saturday</option>
						<option>Sunday</option>
					</select>
				</div>

				<button
					class="rounded-full border border-black uppercase px-10 whitespace-nowrap italic h-12 ml-4 transition-btn"
				>
					Force processing now
				</button>
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
		<VerificationQueueSection />

		<!-- Verified Creators -->
		<VerifiedCreatorsSection />

		<!-- Administrators -->
		<AdministratorsSection />
	</div>
</div>
