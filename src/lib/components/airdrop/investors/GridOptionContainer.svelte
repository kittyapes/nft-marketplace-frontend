<!--
Container for the Wallet/Vault options on the investors page.
Has the left part and a slot for the right part.
-->
<script lang="ts">
	export let title: string, hinataValue: string;
</script>

<div class="flex flex-row border-b-2 border-color-black border-opacity-10">
	<!-- Left Box -->
	<div class="w-2/5 flex-shrink-0 p-14 text-color-black text-2xl">
		<div class="mt-6 font-bold">{title}</div>
		<div class="ml-6 font-bold">{hinataValue} HiNATA</div>
	</div>

	<!-- Rright box -->
	<div class="p-14">
		<slot />
	</div>
</div>
