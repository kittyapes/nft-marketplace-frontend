import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		vite: {
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
					$interfaces: path.resolve('./src/interfaces')
				}
			},
			define: {
				'process.env': process.env
			},
			optimizeDeps: {
				entries: ['jwt-decode'],
				exclude: ['@zerodevx/svelte-toast']
			}
		}
	}
};

export default config;
