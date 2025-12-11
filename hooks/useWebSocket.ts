import { TokenManager } from "@/lib/tokenManager"
import websocketManager from "@/services/websocketManager"
import { useEffect } from "react"
import { AppState } from "react-native"

export const useWebSocketConnection = () => {
	useEffect(() => {
		const initWebSocket = async () => {
			const token = TokenManager.getAccessToken()
			if (token && websocketManager.ws === null) {
				console.log("🔌 Connecting WebSocket globally")
				websocketManager.connect(token)
			}
		}

		initWebSocket()

		// handle app state changer for proper online/offline
		const subscription = AppState.addEventListener("change", async (nextAppState) => {
			const token = TokenManager.getAccessToken()

			if (nextAppState === "active") {
				// app came to foreground - reconnect if needed
				if (websocketManager.ws === null || websocketManager.ws.readyState !== WebSocket.OPEN) {
					console.log("📱 App active - reconnecting WebSocket")
					websocketManager.connect(token)
				}
			} else if (nextAppState === "background") {
				// app went to background - optionally disconnect
				console.log("📱 App backgrounded")
				// websocketManager.disconnect()
			}
		})

		return () => subscription.remove()
	}, [])
}
