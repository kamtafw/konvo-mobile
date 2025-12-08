import { Ionicons } from "@expo/vector-icons"
import React, { Dispatch, SetStateAction } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"

interface Props {
	inputText: string
	setInputText: Dispatch<SetStateAction<string>>
	sendMessage: () => void
}

const MessageInputBar = React.memo<Props>(({ inputText, setInputText, sendMessage }) => {
	return (
		<>
			<View className="border-t border-border bg-background">
				<View className="flex-row items-center px-4 py-3 min-h-16">
					<View className=" flex-1 flex-row items-center mr-3 bg-surface rounded-full">
						<TextInput
							value={inputText}
							onChangeText={setInputText}
							placeholder="Type a message..."
							className="flex-1 px-4 py-3 bg-transparent text-text text-base font-poppins"
							placeholderTextColor="#8a8a8a"
							multiline
							maxLength={1000}
						/>

						{/* Gallery Button */}
						<TouchableOpacity onPress={() => {}} className="p-2.5" activeOpacity={0.7}>
							<Ionicons name="attach-sharp" size={24} className="text-text" />
						</TouchableOpacity>

						{/* Camera Button */}
						<TouchableOpacity onPress={() => {}} className="p-2.5 mr-1" activeOpacity={0.7}>
							<Ionicons name="camera-outline" size={24} className="text-text" />
						</TouchableOpacity>
					</View>

					{/* Send Button */}
					<TouchableOpacity
						onPress={sendMessage}
						className="p-2 rounded-full bg-tint-light"
						activeOpacity={0.8}
					>
						<Ionicons name="send" size={24} className="text-white" />
					</TouchableOpacity>
				</View>
			</View>
		</>
	)
})
MessageInputBar.displayName = "MessageInputBar"

export default MessageInputBar
