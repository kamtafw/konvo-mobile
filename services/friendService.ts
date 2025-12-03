import { api } from "@/api"
import { ENDPOINTS } from "@/constants/endpoints"

export const getFriendsList = async () => {
	const response = await api.get(ENDPOINTS.LIST_FRIENDS)
	return response.data
}

export const getFriendRequests = async () => {
	const response = await api.post(ENDPOINTS.LIST_REQUESTS)
	return response.data
}

export const sendFriendRequest = async (userId: string) => {
	const response = await api.post(ENDPOINTS.SEND_REQUEST, { to_user_id: userId })
	return response.data
}

export const acceptFriendRequest = async (requestId: string) => {
	const response = await api.post(ENDPOINTS.ACCEPT_REQUEST(requestId))
	return response.data
}

export const rejectFriendRequest = async (requestId: string) => {
	const response = await api.post(ENDPOINTS.REJECT_REQUEST(requestId))
	return response.data
}
