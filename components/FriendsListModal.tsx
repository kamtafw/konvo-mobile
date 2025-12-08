import { Image } from "expo-image"
import { router } from "expo-router"
import React, { useCallback, useMemo, useState } from "react"
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
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
		<TouchableOpacity
			className="flex-row items-center px-3 py-4 border-b border-border"
			onPress={() => onProfilePress(friend)}
		>
			{uri ? (
				<Image source={{ uri }} className="w-12 h-12 rounded-full mr-4" />
			) : (
				<View className="mr-4">
					<FallbackAvatar name={friend.username} />
				</View>
			)}
			<View className="flex-1">
				<Text className="text-lg font-poppins-semibold text-text-secondary">{friend.username}</Text>
				<Text className="text-sm font-poppins text-muted" numberOfLines={1}>
					{friend.bio}
				</Text>
			</View>
		</TouchableOpacity>
	)
})
FriendItem.displayName = "FriendItem"

export default function FriendsListModal({ friends, showModal, onClose }: FriendsListModalProps) {
	const [searchQuery, setSearchQuery] = useState<string | null>(null)

	const filteredFriends = useMemo(() => {
		if (!searchQuery) return [...friends].sort((a, b) => a.username.localeCompare(b.username))

		const query = searchQuery.toLowerCase().trim()

		return friends
			.filter((friend) => friend.username.toLowerCase().includes(query))
			.sort((a, b) => a.username.localeCompare(b.username))
	}, [friends, searchQuery])

	const handleProfilePress = useCallback(
		(friend: Profile) => {
			router.push({ pathname: "/chat/[id]", params: { id: friend.id } })

			onClose()
		},
		[onClose]
	)
	const handleClose = useCallback(() => {
		onClose()
		setSearchQuery(null)
	}, [onClose])

	const renderFriendItem = useCallback(
		({ item }: { item: Profile }) => (
			<FriendItem friend={item} onProfilePress={handleProfilePress} />
		),
		[handleProfilePress]
	)

	const renderEmptyComponent = useCallback(
		() => (
			<View className="p-4">
				<Text className="text-center text-muted font-poppins">No friends found</Text>
			</View>
		),
		[]
	)

	return (
		<Modal visible={showModal} animationType="slide" onRequestClose={handleClose}>
			<View className="flex-1 bg-background">
				{/* Header */}
				<View className="px-8 pt-8 pb-4">
					<Text className="text-xl text-tint font-poppins-semibold">Start a chat</Text>
					<Text className="text-sm text-muted font-poppins">
						{filteredFriends.length || 0} friend(s)
					</Text>
				</View>

				{/* Search Bar */}
				<View className="px-4 pb-4">
					<TextInput
						className="px-4 py-3 rounded-full bg-surface text-text font-poppins"
						placeholder="Search friends..."
						onChangeText={setSearchQuery}
						autoCorrect={false}
						clearButtonMode="while-editing"
					/>
				</View>

				{/* Friends List */}
				<FlatList
					data={filteredFriends}
					keyExtractor={(item) => item.id}
					renderItem={renderFriendItem}
					ListEmptyComponent={renderEmptyComponent}
					contentContainerStyle={{ paddingHorizontal: 16 }}
					initialNumToRender={10}
					maxToRenderPerBatch={10}
					windowSize={5}
				/>

				<View className="border-t border-border">
					<TouchableOpacity className="p-4" onPress={handleClose}>
						<Text className="text-center text-tint font-poppins">Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}
