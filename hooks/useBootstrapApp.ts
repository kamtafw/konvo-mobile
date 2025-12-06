import { useAuthStore } from "@/stores/authStore"
import { useFriendStore } from "@/stores/friendStore"
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

				// rehydrate stores in parallel
				await Promise.all([
					useAuthStore.persist.rehydrate(),
					useFriendStore.persist.rehydrate(),
					useSettingsStore.persist.rehydrate(),
				])

				// refresh token if it exists

				// fetch data after refresh
				const newAccessToken = useAuthStore.getState().access

				if (newAccessToken) {
					await Promise.all([
						useFriendStore.getState().fetchFriendsList(),
						useFriendStore.getState().fetchFriendRequests(),
						useFriendStore.getState().fetchFriendSuggestions(),
					])

					// reconnect WebSockets
				}

				setReady(true)
			} catch (err) {
				console.error("❌ Bootstrap error:", err)
				setError(err instanceof Error ? err.message : "Failed to initialize app")
				setReady(true) // to avoid infinite loading
			}
		}

		init()
	}, [])

	// separate effect to handle auth state changes
	useEffect(() => {
		if (!ready) return

		if (isAuthenticated) {
			// connect WebSockets
		} else {
			// disconnect WebSockets
		}
	}, [isAuthenticated, ready])

	return { isAuthenticated, ready, error }
}
