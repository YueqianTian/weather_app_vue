module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			// custom color for application
			colors: {
				'weather-primary': '#00668A',
				'weather-secondary': '#004E71',
				'weather-indigo': '#002f48',
			},
		},
		fontFamily: {
			Roboto: ['Roboto, sans-serif'],
		},
		container: {
			padding: '2rem',
			center: true, // act as margin auto
		},
		screens: {
			sm: '640px',
			md: '768px',
		},
		flex: {
			progressbar: '0 0 55%',
			1: '1 1 0%',
		},
	},
	plugins: [],
};
