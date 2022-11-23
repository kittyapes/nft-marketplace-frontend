<!-- The reason this file exists is that because of the migration before svelte 1.0,
in order to keep the layout reset for components, we would have to place the whole app into
a `(app)` directory, which we didn't wanna do to prevent the need to update all imports and
potentially break the whole app. -->
<script lang="ts">
	import { page } from '$app/stores';
	import Analytics from '$lib/components/Analytics.svelte';
	import AppLayout from './AppLayout.svelte';
	import ComponentsLayout from './ComponentsLayout.svelte';
</script>

{#if import.meta.env.VITE_ENABLE_GTAG === 'true'}
	<Analytics />
{/if}
{#if $page.url.pathname.startsWith('/components')}
	<ComponentsLayout>
		<slot />
	</ComponentsLayout>
{:else}
	<AppLayout>
		<slot />
	</AppLayout>
{/if}
