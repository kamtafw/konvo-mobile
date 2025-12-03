import * as friendService from "@/services/friendService"
import { normalizeFriend, normalizeFriendRequest } from "@/utils/normalizers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface FriendState {
	friendsList: Profile[]
	friendRequests: FriendRequest[]
	loadingFriendsList: boolean
	loadingFriendRequests: boolean
	lastFetchedFriendsListAt: number | null
	lastFetchedFriendRequestsAt: number | null
	error: string | null
	hydrated: boolean

	fetchFriendsList: (opts?: { force?: boolean; maxAgeMs?: number }) => Promise<void>
	fetchFriendRequests: (opts?: { force?: boolean; maxAgeMs?: number }) => Promise<void>
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
			loadingFriendsList: false,
			loadingFriendRequests: false,
			lastFetchedFriendsListAt: null,
			lastFetchedFriendRequestsAt: null,
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
				loadingFriendsList: state.loadingFriendsList,
				loadingFriendRequests: state.loadingFriendRequests,
				lastFetchedFriendsListAt: state.lastFetchedFriendsListAt,
				lastFetchedFriendRequestsAt: state.lastFetchedFriendRequestsAt,
				error: state.error,
				hydrated: state.hydrated,

				fetchFriendsList: state.fetchFriendsList,
				fetchFriendRequests: state.fetchFriendRequests,
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
