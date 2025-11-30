import { vars } from "nativewind"

export const themes = {
	light: vars({
		"--color-text": "#111827",
		"--color-text-secondary": "#4B5563",
		"--color-background": "#FFFFFF",
		"--color-tint": "#004AAD",
		"--color-surface": "#D9E6FF",
		"--color-border": "#E5E7EB",

		"--color-tint-light": "#5C8FE8",

		"--color-success": "#22C55E",
		"--color-warning": "#F59E0B",
		"--color-error": "#EF4444",
		"--color-muted": "#6B7280",
		"--color-offline": "#9CA3AF",
	}),
	dark: vars({
		"--color-text": "#F9FAFB",
		"--color-text-secondary": "#CBD5E1",
		"--color-background": "#0F172A",
		"--color-tint": "#5C8FE8",
		"--color-surface": "#1E293B",
		"--color-border": "#334155",

		"--color-tint-dark": "#004AAD",

		"--color-success": "#4ADE80",
		"--color-warning": "#FACC15",
		"--color-error": "#F87171",
		"--color-muted": "#94A3B8",
		"--color-offline": "#64748B",
	}),
}
