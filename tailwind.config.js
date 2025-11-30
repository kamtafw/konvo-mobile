/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				text: "var(--color-text)",
				"text-secondary": "var(--color-text-secondary)",
				background: "var(--color-background)",
				tint: "var(--color-tint)",
				surface: "var(--color-surface)",
				border: "var(--color-border)",
				"tint-light": "var(--color-tint-light)",
				"tint-dark": "var(--color-tint-dark)",
				success: "var(--color-success)",
				warning: "var(--color-warning)",
				error: "var(--color-error)",
				muted: "var(--color-muted)",
				offline: "var(--color-offline)",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
				"poppins-bold": ["Poppins-Bold", "sans-serif"],
				satoshi: ["Satoshi", "sans-serif"],
				mono: ["SpaceMono", "sans-serif"],
			},
		},
	},
	plugins: [],
}
