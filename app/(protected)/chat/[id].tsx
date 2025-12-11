import MessageBubble from "@/components/MessageBubble"
import MessageInputBar from "@/components/MessageInputBar"
import Title from "@/components/Title"
import { TokenManager } from "@/lib/tokenManager"
import * as chatService from "@/services/chatService"
import websocketManager from "@/services/websocketManager"
import { useAuthStore } from "@/stores/authStore"
import { useFriendStore } from "@/stores/friendStore"
import { normalizeMessage } from "@/utils/normalizers"
import { Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const formatLastSeen = (timestamp: string) => {
	const date = new Date(timestamp)
	const now = new Date()
	const diff = now.getTime() - date.getTime()

	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (minutes < 1) return "just now"
	if (minutes < 60) return `${minutes}m ago`
	if (hours < 24) return `${hours}h ago`
	if (days < 7) return `${days}d ago`

	return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export default function Chat() {
	const { id: friendId } = useLocalSearchParams()

	const friendsList = useFriendStore((state) => state.friendsList)
	const friend = friendsList.find((friend) => friend.id === friendId)

	const user = useAuthStore((state) => state.profile)

	const [messages, setMessages] = useState<Message[]>([])
	const [inputText, setInputText] = useState("")
	const flatListRef = useRef<FlatList>(null)

	// load message history on mount
	useEffect(() => {
		loadMessageHistory()
		markMessagesRead()
	}, [])

	// subscribe to WebSocket events
	useEffect(() => {
		if (!friend) return

		const unsubscribeMessage = websocketManager.on("chat_message", (data: MessageApiResponse) => {
			const normalized = normalizeMessage(data)
			if (normalized.sender.id === friend.id || normalized.recipient_id === friend.id) {
				handleIncomingMessage(normalized)
			}
		})

		const unsubscribeMessageSent = websocketManager.on("message_sent", (data: Message) => {
			handleMessageSent(data)
		})

		const unsubscribeError = websocketManager.on("error", (data: Message) => {
			console.error("Message error:", data)
		})

		return () => {
			unsubscribeMessage()
			unsubscribeMessageSent()
			unsubscribeError()
		}
	}, [friend])

	const connectWebSocket = () => {
		const token = TokenManager.getAccessToken()
		if (token) {
			websocketManager.connect(token)
		}
	}

	const loadMessageHistory = async () => {
		if (!friend) return
		try {
			const data = await chatService.getMessageHistory(friend.id)
			const normalized = data.messages.map(normalizeMessage)
			setMessages(normalized || [])
		} catch (error) {
			console.error("Failed to load message history:", error)
		}
	}

	const markMessagesRead = async () => {
		if (!friend) return
		try {
			await chatService.markMessagesRead(friend.id)
		} catch (error) {
			console.error("Failed to mark messages read:", error)
		}
	}

	const sendMessage = async () => {
		if (!user || !friend) return
		if (!inputText.trim()) return

		const tempId = `temp_${Date.now()}_${Math.random()}`

		// optimistic UI - add message immediately
		const optimisticMessage: Message = {
			temp_id: tempId,
			id: null,
			message: inputText,
			sender: {
				id: user.id,
				username: user.username,
				profile_picture: user.profile_picture,
			},
			recipient_id: friend.id,
			timestamp: new Date().toISOString(),
			status: "sending",
			is_read: false,
		}

		setMessages((prev) => [...prev, optimisticMessage])
		setInputText("")
		scrollToBottom()

		websocketManager.sendMessage(inputText, friend.id, tempId)
	}

	const handleMessageSent = (data: Message) => {
		// Update optimistic message with real ID
		setMessages((prev) =>
			prev.map((msg) =>
				msg.temp_id === data.temp_id
					? { ...msg, id: data.id, status: "sent", timestamp: data.timestamp }
					: msg
			)
		)
	}

	const handleIncomingMessage = (data: Message) => {
		// Check if message already exists (avoid duplicates)
		setMessages((prev) => {
			const exists = prev.find((m) => m.id === data.id || m.temp_id === data.temp_id)
			if (exists) return prev
			return [...prev, data]
		})
		markMessagesRead()

		scrollToBottom()
	}

	const scrollToBottom = () => {
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true })
		}, 100)
	}

	const keyExtractor = useCallback(
		(item: Message, index: number) => (item.id ? item.id : item.temp_id || String(index)),
		[]
	)

	const contentContainerStyle = useMemo(
		() => ({
			paddingVertical: 8,
			flexGrow: 1,
		}),
		[]
	)

	const renderMessage = ({ item }: { item: Message }) => {
		const isMyMessage = item.sender.id !== friend!.id

		return <MessageBubble message={item} isMyMessage={isMyMessage} />
	}

	if (!friend) return null

	return (
		<>
			<Stack.Screen
				options={{
					header: () => (
						<Title
							name={friend.username}
							uri={friend.profile_picture}
							isOnline={friend.is_online}
							lastSeen={formatLastSeen(friend.last_seen)}
						/>
					),
				}}
			/>
			<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
				<KeyboardAvoidingView className="flex-1">
					{/* Messages */}
					<FlatList
						ref={flatListRef}
						data={messages}
						keyExtractor={keyExtractor}
						renderItem={renderMessage}
						contentContainerStyle={contentContainerStyle}
						onContentSizeChange={scrollToBottom}
						showsVerticalScrollIndicator={false}
						maintainVisibleContentPosition={{
							minIndexForVisible: 0,
							autoscrollToTopThreshold: 10,
						}}
					/>

					{/* Message-Input Bar */}
					<MessageInputBar
						inputText={inputText}
						setInputText={setInputText}
						sendMessage={sendMessage}
					/>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</>
	)
}
