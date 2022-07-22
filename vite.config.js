import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$stores: path.resolve('./src/stores'),
			$styles: path.resolve('./src/styles'),
			$utils: path.resolve('./src/utils'),
			$components: path.resolve('./src/lib/components'),
			$constants: path.resolve('./src/constants'),
			$icons: path.resolve('./src/icons'),
			$contracts: path.resolve('./src/contracts'),
			$actions: path.resolve('./src/actions'),
			$interfaces: path.resolve('./src/interfaces'),
			$scripts: path.resolve('./src/scripts')
		}
	},
	define: {
		'process.env': process.env
	},
	optimizeDeps: {
		entries: ['jwt-decode'],
		exclude: ['@zerodevx/svelte-toast']
	},
	assetsInclude: ['./static/js/wallets.js']
};

export default config;
