import FloatingActionButton from "@/components/FloatingActionButton"
import FriendsListModal from "@/components/FriendsListModal"
import { TextInput, View } from "react-native"

export default function Chat() {
	return (
		<View className="flex-1 pt-6 bg-background">
			{/* Search Bar */}
			<View className="px-4 pb-4">
				<TextInput
					placeholder="Search chats or users"
					className="px-4 py-3 rounded-full bg-surface text-text font-poppins"
				/>
			</View>

			{/* Floating Action Button */}
			<FloatingActionButton onPress={() => {}} />

			{/* Friends List Modal */}
			{/* <FriendsListModal friends={} showModal={} onClose={} /> */}
		</View>
	)
}
