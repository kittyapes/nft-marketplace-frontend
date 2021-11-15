const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'color-black': '#1A1A1A',
				'color-red': '#D61717',
				'color-purple': '#868BF7',
				'color-blue': '#6CC7F8'
			}
		}
	},

	plugins: [require('@tailwindcss/aspect-ratio')]
};

module.exports = config;
