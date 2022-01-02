const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'color-black': '#1A1A1A',
				'color-gray': {
					lightest: '#F9F9F9',
					lighter: '#F2F2F2',
					light: '#D8D8D8',
					base: '#4D4D4D',
					dark: '#1D1D1DB2'
				},
				'color-red': '#D61717',
				'color-purple': '#868BF7',
				'color-blue': '#6CC7F8',
				'color-pink': {
					dark: '#A95ABC'
				}
			},
			screens: {
				'2k': '2048px',
				'4k': '3840px'
			}
		}
	},

	plugins: [require('@tailwindcss/aspect-ratio'), require('tailwind-scrollbar-hide')]
};

module.exports = config;
