import FallbackAvatar from "@/components/FallbackAvatar"
import FloatingActionButton from "@/components/FloatingActionButton"
import FriendsListModal from "@/components/FriendsListModal"
import { TokenManager } from "@/lib/tokenManager"
import * as chatService from "@/services/chatService"
import websocketManager from "@/services/websocketManager"
import { useFriendStore } from "@/stores/friendStore"
import { normalizeChat, normalizeMessage } from "@/utils/normalizers"
import { useFocusEffect } from "@react-navigation/native"
import { clsx } from "clsx"
import { Image } from "expo-image"
import { router } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"

interface ChatItemProps {
	chat: Chat
	onChatPress: (chat: Chat) => void
}

const formatTimestamp = (timestamp: string) => {
	const date = new Date(timestamp)
	const now = new Date()
	const diff = now.getTime() - date.getTime()

	// less than 1 day ago - show time
	if (diff < 24 * 60 * 60 * 1000) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	}

	// less than 7 days ago - show day
	if (diff < 7 * 24 * 60 * 60 * 1000) {
		return date.toLocaleDateString([], { weekday: "short" })
	}

	// older - show date
	return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

const ChatItem = React.memo<ChatItemProps>(({ chat, onChatPress }) => {
	const uri = chat.friend.profile_picture
	const isUnread = chat.unread_count > 0
	const isMyMessage = chat.last_message.sender_id !== chat.friend.id

	return (
		<TouchableOpacity
			className="flex-row items-center p-4 border-b border-border"
			onPress={() => onChatPress(chat)}
		>
			{/* Avatar */}
			<View className="relative mr-4">
				{uri ? (
					<Image source={{ uri }} className="w-12 h-12 rounded-full" />
				) : (
					<FallbackAvatar name={chat.friend.username} is_online={chat.friend.is_online} />
				)}

				{chat.friend.is_online && (
					<View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-background" />
				)}
			</View>

			{/* Chat Info */}
			<View className="flex-1">
				<View className="flex-row justify-between mb-1">
					<Text
						className={clsx(
							"text-base text-text-secondary",
							isUnread ? "font-poppins-semibold" : "font-poppins"
						)}
					>
						{chat.friend.username}
					</Text>
					<Text className="text-sm font-poppins text-muted">
						{formatTimestamp(chat.last_message.timestamp)}
					</Text>
				</View>

				<View className="flex-row justify-between items-center">
					<Text
						numberOfLines={1}
						className={clsx(
							"flex-1 text-sm",
							isUnread ? "text-text font-poppins-semibold" : "text-offline font-poppins"
						)}
					>
						{isMyMessage && "You: "}
						{chat.last_message.message}
					</Text>

					{isUnread && (
						<View className="bg-tint rounded-xl min-w-5 h-5 justify-center items-center ml-2 px-[6px]">
							<Text className="text-white text-sm font-poppins-semibold">{chat.unread_count}</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)
})
ChatItem.displayName = "ChatItem"

export default function Chat() {
	const friendsList = useFriendStore((state) => state.friendsList)
	const subscribeToStatusUpdates = useFriendStore((state) => state.subscribeToStatusUpdates)

	const [chats, setChats] = useState<Chat[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [showFriendsList, setShowFriendsList] = useState(false)

	useFocusEffect(
		useCallback(() => {
			fetchChats()
		}, [])
	)

	useEffect(() => {
		useFriendStore.getState().fetchFriendsList()

		const unsubscribeStatus = subscribeToStatusUpdates()

		return () => unsubscribeStatus()
	}, [subscribeToStatusUpdates])

	useEffect(() => {
		const unsubscribeMessage = websocketManager.on("chat_message", (data: MessageApiResponse) => {
			const normalized = normalizeMessage(data)
			updateChatWithNewMessage(normalized)
		})

		const updateChatWithNewMessage = (message: Message) => {
			setChats((prevChats) => {
				const existingChatIndex = prevChats.findIndex(
					(chat) => chat.friend.id === message.sender.id || chat.friend.id === message.recipient_id
				)

				const newLastMessage = {
					id: String(message.id),
					message: message.message,
					timestamp: message.timestamp,
					sender_id: message.sender.id,
					recipient_id: message.recipient_id,
					is_read: false,
				}

				if (existingChatIndex >= 0) {
					const updatedChats = [...prevChats]
					const existingChat = updatedChats[existingChatIndex]

					const updatedChat = {
						...existingChat,
						last_message: newLastMessage,
						unread_count:
							newLastMessage.sender_id === existingChat.friend.id
								? (existingChat.unread_count || 0) + 1
								: existingChat.unread_count,
					}

					updatedChats.splice(existingChatIndex, 1)
					updatedChats.unshift(updatedChat)

					return updatedChats
				} else {
					fetchChats()
					return prevChats
				}
			})
		}

		return () => unsubscribeMessage()
	}, [])

	const handleOpenFriendsList = useCallback(() => setShowFriendsList(true), [])
	const handleCloseFriendsList = useCallback(() => setShowFriendsList(false), [])

	const connectWebSocket = () => {
		const token = TokenManager.getAccessToken()
		if (token) {
			websocketManager.connect(token)
		}
	}

	const fetchChats = async (isRefresh = false) => {
		try {
			if (!isRefresh) setIsLoading(true)

			const data = await chatService.getRecentChats()
			const normalized = data.chats.map(normalizeChat)
			setChats(normalized || [])
		} catch (error) {
			console.error("Failed to load chats:", error)
		} finally {
			setIsLoading(false)
			setIsRefreshing(false)
		}
	}

	const onRefresh = () => {
		setIsRefreshing(true)
		fetchChats(true)
	}

	const handleChatPress = useCallback((chat: Chat) => {
		router.push({ pathname: "/chat/[id]", params: { id: chat.friend.id } })
	}, [])

	const renderChatItem = useCallback(
		({ item }: { item: Chat }) => {
			const friendWithStatus = friendsList.find((f) => f.id === item.friend.id) || item.friend
			const chatWithStatus = { ...item, friend: friendWithStatus }

			return <ChatItem chat={chatWithStatus} onChatPress={handleChatPress} />
		},
		[friendsList, handleChatPress]
	)

	const renderEmptyComponent = useCallback(
		() => (
			<View className="flex-1 bg-background justify-center items-center p-4">
				<Text className="text-center text-base text-muted font-poppins mb-4">No chats yet</Text>
				<Text className="text-center text-sm text-muted font-poppins">
					Start a conversation with a friend!
				</Text>
			</View>
		),
		[]
	)

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" className="text-tint" />
			</View>
		)
	}

	return (
		<View className="flex-1 pt-6 bg-background">
			{/* Search Bar */}
			{chats.length > 0 ? (
				<View className="px-4 pb-4">
					<TextInput
						placeholder="Search chats or users..."
						className="px-4 py-3 rounded-full bg-surface text-text font-poppins placeholder:text-muted"
					/>
				</View>
			) : (
				renderEmptyComponent()
			)}

			{/* Existing Chats */}
			<FlatList
				data={chats}
				keyExtractor={(item) => item.friend.id.toString()}
				renderItem={renderChatItem}
				contentContainerStyle={{ paddingHorizontal: 16 }}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				windowSize={5}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
			/>

			{/* Floating Action Button */}
			<FloatingActionButton onPress={handleOpenFriendsList} />

			{/* Friends List Modal */}
			<FriendsListModal
				friends={friendsList}
				showModal={showFriendsList}
				onClose={handleCloseFriendsList}
			/>
		</View>
	)
}
