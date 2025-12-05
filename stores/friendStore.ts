import * as friendService from "@/services/friendService"
import { normalizeFriend, normalizeFriendRequest, normalizeProfile } from "@/utils/normalizers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface FriendState {
	friendsList: Profile[]
	friendRequests: FriendRequest[]
	friendSuggestions: Profile[]
	loadingFriendsList: boolean
	loadingFriendRequests: boolean
	loadingFriendSuggestions: boolean
	lastFetchedFriendsListAt: number | null
	lastFetchedFriendRequestsAt: number | null
	lastFetchedFriendSuggestionsAt: number | null
	error: string | null
	hydrated: boolean

	fetchFriendsList: (opts?: { force?: boolean; maxAgeMs?: number }) => Promise<void>
	fetchFriendRequests: (opts?: { force?: boolean; maxAgeMs?: number }) => Promise<void>
	fetchFriendSuggestions: (opts?: { force?: boolean; maxAgeMs?: number }) => Promise<void>
	sendFriendRequest: (userId: string) => Promise<void>
	acceptFriendRequest: (requestId: string) => Promise<void>
	rejectFriendRequest: (requestId: string) => Promise<void>

	reset: () => void
}

export const useFriendStore = create(
	persist<FriendState>(
		(set, get) => ({
			friendsList: [],
			friendRequests: [],
			friendSuggestions: [],
			loadingFriendsList: false,
			loadingFriendRequests: false,
			loadingFriendSuggestions: false,
			lastFetchedFriendsListAt: null,
			lastFetchedFriendRequestsAt: null,
			lastFetchedFriendSuggestionsAt: null,
			error: null,
			hydrated: false,

			fetchFriendsList: async ({ force = false, maxAgeMs = 60000 } = {}) => {
				const { lastFetchedFriendsListAt, friendsList } = get()
				const isStale =
					!lastFetchedFriendsListAt || Date.now() - lastFetchedFriendsListAt > maxAgeMs

				if (!force && friendsList.length > 0 && !isStale) return

				set({ loadingFriendsList: true, error: null })

				try {
					const data = await friendService.getFriendsList()
					const normalized = data.map(normalizeFriend)

					set({ friendsList: normalized, lastFetchedFriendsListAt: Date.now() })
				} catch (err: any) {
					set({ error: err?.message || "Failed to load friends list" })
				} finally {
					set({ loadingFriendsList: false })
				}
			},
			fetchFriendRequests: async ({ force = false, maxAgeMs = 60000 } = {}) => {
				const { lastFetchedFriendRequestsAt, friendRequests } = get()
				const isStale =
					!lastFetchedFriendRequestsAt || Date.now() - lastFetchedFriendRequestsAt > maxAgeMs

				if (!force && friendRequests.length > 0 && !isStale) return

				set({ loadingFriendRequests: true, error: null })

				try {
					const data = await friendService.getFriendRequests()
					const normalized = data.map(normalizeFriendRequest)

					set({ friendRequests: normalized, lastFetchedFriendRequestsAt: Date.now() })
				} catch (err: any) {
					set({ error: err?.message || "Failed to load friend requests" })
				} finally {
					set({ loadingFriendRequests: false })
				}
			},
			fetchFriendSuggestions: async ({ force = false, maxAgeMs = 60000 } = {}) => {
				const { lastFetchedFriendSuggestionsAt, friendSuggestions } = get()
				const isStale =
					!lastFetchedFriendSuggestionsAt || Date.now() - lastFetchedFriendSuggestionsAt > maxAgeMs

				if (!force && friendSuggestions.length > 0 && !isStale) return

				set({ loadingFriendSuggestions: true, error: null })

				try {
					const data = await friendService.getFriendSuggestions()
					const normalized = data.map(normalizeProfile)

					set({ friendSuggestions: normalized, lastFetchedFriendSuggestionsAt: Date.now() })
				} catch (err: any) {
					set({ error: err?.message || "Failed to load friend suggestions" })
				} finally {
					set({ loadingFriendSuggestions: false })
				}
			},
			sendFriendRequest: async (userId) => {
				set({ error: null })
				try {
					await friendService.sendFriendRequest(userId)
				} catch (err: any) {
					set({ error: err?.message || "Failed to send friend request" })
				}
			},
			acceptFriendRequest: async (requestId) => {
				set({ error: null })
				try {
					await friendService.acceptFriendRequest(requestId)
				} catch (err: any) {
					set({ error: err?.message || "Failed to accept friend request." })
				}
			},
			rejectFriendRequest: async (requestId) => {
				set({ error: null })
				try {
					await friendService.rejectFriendRequest(requestId)
				} catch (err: any) {
					set({ error: err?.message || "Failed to reject friend request." })
				}
			},
			reset: () => {},
		}),
		{
			name: "friends-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				friendsList: state.friendsList,
				friendRequests: state.friendRequests,
				friendSuggestions: state.friendSuggestions,
				loadingFriendsList: state.loadingFriendsList,
				loadingFriendRequests: state.loadingFriendRequests,
				loadingFriendSuggestions: state.loadingFriendSuggestions,
				lastFetchedFriendsListAt: state.lastFetchedFriendsListAt,
				lastFetchedFriendRequestsAt: state.lastFetchedFriendRequestsAt,
				lastFetchedFriendSuggestionsAt: state.lastFetchedFriendSuggestionsAt,
				error: state.error,
				hydrated: state.hydrated,

				fetchFriendsList: state.fetchFriendsList,
				fetchFriendRequests: state.fetchFriendRequests,
				fetchFriendSuggestions: state.fetchFriendSuggestions,
				sendFriendRequest: state.sendFriendRequest,
				acceptFriendRequest: state.acceptFriendRequest,
				rejectFriendRequest: state.rejectFriendRequest,
				reset: state.reset,
			}),
			onRehydrateStorage: () => async (state) => {
				if (!state) return

				const { lastFetchedFriendsListAt, friendsList } = state
				const isStale = !lastFetchedFriendsListAt || Date.now() - lastFetchedFriendsListAt > 60000

				if (!friendsList || friendsList.length === 0 || isStale) {
					await state.fetchFriendsList?.({ force: false })
				}

				// set({ hydrated: true })
			},
		}
	)
)
