import { LoginSchema, SignupSchema } from "@/lib/formSchema"
import { TokenManager } from "@/lib/tokenManager"
import * as authService from "@/services/authService"
import websocketManager from "@/services/websocketManager"
import { normalizeProfile } from "@/utils/normalizers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const getFriendStore = () => import("./friendStore").then((m) => m.useFriendStore)

const SecureStorage = {
	getItem: async (name: string) => {
		const value = await SecureStore.getItemAsync(name)
		return value ?? null
	},
	setItem: async (name: string, value: string) => {
		await SecureStore.setItemAsync(name, value)
	},
	removeItem: async (name: string) => {
		await SecureStore.deleteItemAsync(name)
	},
}

interface AuthState {
	profile: Profile | null
	access: string | null
	refresh: string | null
	isAuthenticated: boolean

	signup: (payload: SignupSchema) => Promise<void>
	login: (payload: LoginSchema) => Promise<void>
	refreshToken: () => Promise<void>
	logout: () => void
}

export const useAuthStore = create(
	persist<AuthState>(
		(set, get) => ({
			profile: null,
			access: null,
			refresh: null,
			isAuthenticated: false,

			signup: async (payload) => {
				try {
					const { profile, access, refresh } = await authService.signup(payload)
					const normalized = normalizeProfile(profile)

					TokenManager.setTokens(access, refresh)
					set({ profile: normalized, access, refresh, isAuthenticated: true })

					console.log(`✅ Signup successful for user: ${profile.id}`)
				} catch (error) {
					console.error("❌ Signup failed:", error)
					throw error
				}
			},

			login: async (payload) => {
				try {
					const { profile, access, refresh } = await authService.login(payload)
					const normalized = normalizeProfile(profile)

					TokenManager.setTokens(access, refresh)
					set({ profile: normalized, access, refresh, isAuthenticated: true })

					console.log(`✅ Login complete for user: ${profile.id}`)
				} catch (error) {
					console.error("❌ Login failed:", error)
					throw error
				}
			},

			refreshToken: async () => {},

			logout: async () => {
				try {
					websocketManager.disconnect()
					
					TokenManager.clearTokens()
					
					set({ profile: null, access: null, refresh: null, isAuthenticated: false })

					const friendStore = await getFriendStore()
					friendStore.getState().reset()

					await Promise.all([
						SecureStore.deleteItemAsync("auth-storage").catch(() => {}),
						AsyncStorage.removeItem("friends-storage").catch(() => {}),
					])


					console.log(`✅ Logout complete, all storage cleared`)
				} catch (error) {
					console.error("❌ Logout error:", error)
					// continue with logout even if there's an error
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => SecureStorage),
			partialize: (state) => ({
				profile: state.profile,
				access: state.access,
				refresh: state.refresh,
				isAuthenticated: state.isAuthenticated,
				login: state.login,
				logout: state.logout,
				signup: state.signup,
				refreshToken: state.refreshToken,
			}),
			onRehydrateStorage: () => (state) => {
				if (state?.access && state?.refresh) {
					TokenManager.setTokens(state.access, state.refresh)
					console.log("✅ Tokens synced with TokenManager on rehydration")
				}
			},
		}
	)
)
