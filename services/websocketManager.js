import { ENDPOINTS } from "@/constants/endpoints"

class WebSocketManager {
	constructor() {
		this.ws = null
		this.listeners = new Map()
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = 5
		this.isIntentionallyClosed = false
	}

	connect(token) {
		const wsUrl = `ws://${ENDPOINTS.IPv4}:8000/ws/chat/?token=${token}`

		this.ws = new WebSocket(wsUrl)
		this.intentionallyClose = false


		this.ws.onopen = () => {
			console.log("✅ WebSocket connected")
			this.reconnectAttempts = 0
			this.notifyListeners("connection", { status: "connected" })
		}

		this.ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				console.log("📨 WebSocket message:", data)

				this.notifyListeners(data.type, data)
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error)
			}
		}

		this.ws.onerror = (error) => {
			console.error("❌ WebSocket error:", error)
			this.notifyListeners("error", { error })
		}

		this.ws.onclose = (event) => {
			console.log("❌ WebSocket closed:", event.code, event.reason)
			this.notifyListeners("connection", { status: "disconnected" })

			if (!this.isIntentionallyClosed) {
				this.handleReconnect(token)
			}
		}
	}

	handleReconnect(token) {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

			console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`)

			setTimeout(() => {
				this.connect(token)
			}, delay)
		} else {
			console.error("Max reconnection attempts reached")
			this.notifyListeners("connection", { status: "failed" })
		}
	}

	send(data) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data))
			return true
		} else {
			console.error("WebSocket is not connected")
			return false
		}
	}

	sendMessage(message, recipientId, tempId) {
		return this.send({
			type: "chat_message",
			message: message,
			recipient_id: recipientId,
			temp_id: tempId,
		})
	}

	on(eventType, callback) {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, [])
		}
		this.listeners.get(eventType).push(callback)

		return () => {
			const callbacks = this.listeners.get(eventType)
			if (callbacks) {
				const index = callbacks.indexOf(callback)
				if (index > -1) {
					callbacks.splice(index, 1)
				}
			}
		}
	}

	notifyListeners(eventType, data) {
		const callbacks = this.listeners.get(eventType)
		if (callbacks) {
			callbacks.forEach((callback) => callback(data))
		}
	}

	disconnect() {
		this.intentionallyClose = true
		if (this.ws) {
			this.ws.close()
			this.ws = null
		}
		this.listeners.clear()
	}
}

export default new WebSocketManager()
