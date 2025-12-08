import { useFriendStore } from "@/stores/friendStore"
import { useMemo } from "react"
import * as chatService from "@/services/chatService"

const PLACEHOLDER_PREFIX = "placeholder_"
const TEMPORARY_PREFIX = "temp_"
const NEW_CHAT_ID = "new"

interface ChatResolutionProps {
	chat: null
	chatId: string | null
	friend: Profile | null
}

const isNewChat = (id: string | undefined): boolean => id === NEW_CHAT_ID

const findChatById = () => {}

export const useChatResolution = async (
	userId: string,
	friendId: string | undefined
): Promise<ChatResolutionProps> => {
	// hook to resolve messages and friend information

	const friendsList = useFriendStore((state) => state.friendsList)
	const friend = friendsList.find((friend) => friend.id === friendId)


	const data = await chatService.getMessageHistory(friend.id)

	return useMemo(() => {
		// Case 1: Existing chat by ID
		if (chatId && !isNewChat(chatId)) {
			const chat = null // find chat from chats by chatId
			const friend = null // find friend profile
			return { chat: chat || null, friend: friend || null, chatId }
		}

		// Case 2: New or existing chat with friend
		if (friendId) {
			const existingChat = null // find existing chat from chats by friendId
			if (existingChat) {
				const friend = null // find friend profile
				return { chat: existingChat, friend: friend || null, chatId: existingChat.id }
			}

			// Check for optimistic chat
			const optimisticChat = null // find optimistic chat from chats by friendId
			if (optimisticChat) {
				const friend = friendsList.find((friend) => friend.id === friendId)
				return { chat: optimisticChat, friend: friend || null, chatId: optimisticChat.id }
			}

			// Definitely new chat - return friend profile only
			const friend = friendsList.find((friend) => friend.id === friendId)
			return { chat: null, friend: friend || null, chatId: null }
		}

		return { chat: null, friend: null, chatId: null }
	}, [chatId, friendId, friendsList])
}
