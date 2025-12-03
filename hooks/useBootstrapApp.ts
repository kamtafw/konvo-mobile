import { useAuthStore } from "@/stores/authStore"
import { useSettingsStore } from "@/stores/settingsStore"
import { useEffect, useRef, useState } from "react"

export const useBootstrapApp = () => {
	const [ready, setReady] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const hasInitialized = useRef(false) // prevent double initialization

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const accessToken = useAuthStore((state) => state.access)

	useEffect(() => {
		if (hasInitialized.current) return
		hasInitialized.current = true

		const init = async () => {
			try {
				console.log("🚀 Bootstrapping app...")

				await Promise.all([useAuthStore.persist.rehydrate(), useSettingsStore.persist.rehydrate()])

				setReady(true)
			} catch (err) {
				console.error("❌ Bootstrap error:", err)
				setError(err instanceof Error ? err.message : "Failed to initialize app")
				setReady(true) // to avoid infinite loading
			}
		}

		init()
	}, [])

	return { isAuthenticated, ready, error }
}
