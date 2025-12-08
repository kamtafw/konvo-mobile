import { clsx } from "clsx"
import React, { useMemo } from "react"
import { Text, View } from "react-native"

interface Props {
	message: Message
	isMyMessage: boolean
}

const MessageBubble = React.memo<Props>(({ message, isMyMessage }) => {
	const formattedTime = useMemo(() => {
		return new Date(message.timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		})
	}, [message.timestamp])

	return (
		<View
			className={clsx(
				"p-3 rounded-xl mx-3 my-1 max-w-[70%]",
				isMyMessage ? "self-end bg-tint" : "self-start bg-surface"
			)}
		>
			<Text className={clsx("text-base font-poppins", isMyMessage && "text-white")}>
				{message.message}
			</Text>
			<Text
				className={clsx(
					"text-[10px] font-poppins mt-1",
					isMyMessage ? "text-white opacity-70" : "text-text-secondary"
				)}
			>
				{formattedTime}
				{isMyMessage && message.status && ` • ${message.status}`}
			</Text>
		</View>
	)
})
MessageBubble.displayName = "MessageBubble"

export default MessageBubble
