import { api } from "@/api"
import { ENDPOINTS } from "@/constants/endpoints"

export const getMessageHistory = async (friendId: string) => {
	const response = await api.get(ENDPOINTS.MESSAGE_HISTORY(friendId))
	return response.data
}
