<script lang='ts'>
	import { browser } from '$app/env';
	import NftDisplay from './NftDisplay.svelte';
</script>

<div
	class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0"
	class:hidden={!browser}
>
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div
		class="bg-white w-full lg:w-2/3  mx-auto rounded-xl shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden"
		style="height:640px"
	>

        <NftDisplay></NftDisplay>

        <!-- Right side of popup -->
        <div class="w-full md:w-1/2 bg-white p-9 flex flex-col h-full">
            <slot name='content'></slot>
			<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
        </div>
    </div>
</div>