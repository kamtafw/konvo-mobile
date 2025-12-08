import FloatingActionButton from "@/components/FloatingActionButton"
import FriendsListModal from "@/components/FriendsListModal"
import { useFriendStore } from "@/stores/friendStore"
import { useCallback, useEffect, useState } from "react"
import { TextInput, View } from "react-native"

export default function Chat() {
	const friendsList = useFriendStore((state) => state.friendsList)

	const [showFriendsList, setShowFriendsList] = useState(false)

	useEffect(() => {
		useFriendStore.getState().fetchFriendsList()
	}, [])

	const handleOpenFriendsList = useCallback(() => setShowFriendsList(true), [])
	const handleCloseFriendsList = useCallback(() => setShowFriendsList(false), [])

	return (
		<View className="flex-1 pt-6 bg-background">
			{/* Search Bar */}
			<View className="px-4 pb-4">
				<TextInput
					placeholder="Search chats or users..."
					className="px-4 py-3 rounded-full bg-surface text-text font-poppins"
				/>
			</View>

			{/* Existing Chats */}
			

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
