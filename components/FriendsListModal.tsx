import { Image } from "expo-image"
import React from "react"
import { Modal, TouchableOpacity, View } from "react-native"
import FallbackAvatar from "./FallbackAvatar"

interface FriendItemProps {
	friend: Profile
	onProfilePress: (friend: Profile) => void
}

interface FriendsListModalProps {
	friends: Profile[]
	showModal: boolean
	onClose: () => void
}

const FriendItem = React.memo<FriendItemProps>(({ friend, onProfilePress }) => {
	const uri = friend.profile_picture

	return (
		<TouchableOpacity>
			{uri ? (
				<Image source={{ uri }} className="w-12 h-12 rounded-full mr-4" />
			) : (
				<View className="mr-4">
					<FallbackAvatar name={friend.username} />
				</View>
			)}
		</TouchableOpacity>
	)
})
FriendItem.displayName = "FriendItem"

export default function FriendsListModal({ friends, showModal, onClose }: FriendsListModalProps) {
	return <Modal visible={showModal} animationType="slide">
		

	</Modal>	
}
