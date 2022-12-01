<script lang="ts">
	import { page } from '$app/stores';

	$: {
		if (typeof gtag !== 'undefined') {
			if ($page.url.search?.length > 0) {
				gtag('config', 'G-CR6K8TWSTW', {
					page_title: document.title,
					page_path: $page.url.pathname,
					page_location: `${$page.url.host}${$page.url.pathname}?${$page.url.search}`,
				});
			} else {
				gtag('config', 'G-CR6K8TWSTW', {
					page_title: document.title,
					page_path: $page.url.pathname,
					page_location: `${$page.url.host}${$page.url.pathname}`,
				});
			}
		}
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-CR6K8TWSTW">
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-CR6K8TWSTW');
	</script>
</svelte:head>
