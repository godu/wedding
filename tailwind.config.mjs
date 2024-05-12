/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {},
			colors: {
				gold: "#d4af37",
				canard: "#264b56",
			},
			width: {
				160: "40rem",
			},
		},
	},
};
