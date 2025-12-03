import { ENDPOINTS } from "@/constants/endpoints"
import { TokenManager } from "@/lib/tokenManager"
import axios from "axios"

const BASE_URL = `http://${ENDPOINTS.IPv4}:8000/api/`

const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10_000,
})

apiClient.interceptors.request.use(
	async (config) => {
		const access = TokenManager.getAccessToken()

		if (access) {
			config.headers.Authorization = `Bearer ${access}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor to handle 401 errors and refresh tokens
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			const refresh = TokenManager.getRefreshToken()

			if (refresh) {
				try {
					const response = await axios.post(`${BASE_URL}accounts/token/refresh/`, {
						refresh,
					})

					const newAccessToken = response.data.access
					TokenManager.updateAccessToken(newAccessToken)

					try {
						const { useAuthStore } = await import("@/stores/authStore")
						useAuthStore.getState().access = newAccessToken
					} catch (err) {
						console.warn("Could not update authStore:", err)
					}

					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

					return apiClient(originalRequest)
				} catch (refreshError) {
					TokenManager.clearTokens()

					try {
						const { useAuthStore } = await import("@/stores/authStore")
						useAuthStore.getState().logout()
					} catch (err) {
						console.error("Could not trigger logout:", err)
					}

					return Promise.reject(refreshError)
				}
			}
		}
	}
)

export default apiClient
