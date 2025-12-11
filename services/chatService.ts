import { api } from "@/api"
import { ENDPOINTS } from "@/constants/endpoints"

export const getMessageHistory = async (friendId: string) => {
	const response = await api.get(ENDPOINTS.MESSAGE_HISTORY(friendId))
	return response.data
}

export const getRecentChats = async () => {
	const response = await api.get(ENDPOINTS.RECENT_CHATS)
	return response.data
}

export const markMessagesRead = async (friendId: string) => {
	const response = await api.post(ENDPOINTS.MARK_MESSAGES_READ(friendId))
	return response.data
}
