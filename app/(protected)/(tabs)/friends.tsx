import FallbackAvatar from "@/components/FallbackAvatar"
import { useFriendStore } from "@/stores/friendStore"
import { Image } from "expo-image"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Props {
	friend: Profile
	onProfilePress: (friend: Profile) => void
}

const FriendRequestItem = React.memo<Props>(({ friend, onProfilePress }) => {
	const uri = friend.profile_picture

	return (
		<View className="flex-row items-center px-3 py-4 border-b border-border">
			<TouchableOpacity
				className="flex-1 flex-row items-center"
				onPress={() => onProfilePress(friend)}
			>
				{/* Profile Picture */}
				{uri ? (
					<Image source={{ uri }} className="w-16 h-16 rounded-full mr-4" />
				) : (
					<View className="mr-4">
						<FallbackAvatar name={friend.username} size={16} />
					</View>
				)}

				<View className="flex-1 gap-1">
					{/* Username */}
					<Text className="text-lg px-3 font-poppins-semibold text-text-secondary">
						{friend.username}
					</Text>

					{/* Response Buttons */}
					<View className="flex-row flex-1 items-center gap-4">
						<TouchableOpacity className="flex-1 py-2 w-1/3 bg-tint rounded-full">
							<Text className="text-center text-white font-poppins">Accept</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 py-2 w-1/3 bg-surface rounded-full">
							<Text className="text-center font-poppins">Decline</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
})
FriendRequestItem.displayName = "FriendRequestItem"

const FriendSuggestionItem = React.memo<Props>(({ friend, onProfilePress }) => {
	const uri = friend.profile_picture

	return (
		<View className="flex-row items-center px-3 py-4 border-b border-border">
			<TouchableOpacity
				className="flex-1 flex-row items-center"
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
					<Text className="text-lg font-poppins-semibold text-text-secondary">
						{friend.username}
					</Text>
					<Text className="text-sm font-poppins text-muted">{friend.phone_number}</Text>
				</View>
			</TouchableOpacity>

			{/* Response Buttons */}
			<TouchableOpacity className="px-6 py-2 bg-tint rounded-full">
				<Text className="text-center text-white font-poppins">Add</Text>
			</TouchableOpacity>
		</View>
	)
})
FriendSuggestionItem.displayName = "FriendSuggestionItem"

export default function Friends() {
	const [selectedTab, setSelectedTab] = useState<"requests" | "suggestions">("requests")
	const friendRequests = useFriendStore((state) => state.friendRequests)
	const friendSuggestions = useFriendStore((state) => state.friendSuggestions)

	useEffect(() => {
		useFriendStore.getState().fetchFriendRequests()
		useFriendStore.getState().fetchFriendSuggestions()
	}, [])

	const renderFriendRequestItem = useCallback(
		({ item }: { item: FriendRequest }) => (
			<FriendRequestItem friend={item.from_user} onProfilePress={() => {}} />
		),
		[]
	)

	const renderFriendSuggestionItem = useCallback(
		({ item }: { item: Profile }) => (
			<FriendSuggestionItem friend={item} onProfilePress={() => {}} />
		),
		[]
	)

	const renderEmptyComponent = useCallback(
		() => (
			<View className="p-4">
				<Text className="text-center text-muted font-poppins">No friend {selectedTab} found</Text>
			</View>
		),
		[selectedTab]
	)

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
			<View className="flex-1 px-4 py-6">
				{/* Toggle Buttons */}
				<View className="flex-row mb-5 rounded-full bg-surface">
					<TouchableOpacity
						className={`w-[50%] px-4 py-3 rounded-full ${selectedTab === "requests" && "bg-tint"}`}
						onPress={() => setSelectedTab("requests")}
					>
						<Text
							className={`text-center font-poppins ${selectedTab === "requests" ? "text-white" : "text-muted"}`}
						>
							New Requests
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`w-[50%] px-4 py-3 rounded-full ${selectedTab === "suggestions" && "bg-tint"}`}
					>
						<Text
							className={`text-center font-poppins ${selectedTab === "suggestions" ? "text-white" : "text-muted"}`}
							onPress={() => setSelectedTab("suggestions")}
						>
							Friend Suggestions
						</Text>
					</TouchableOpacity>
				</View>

				{/* Friend Requests */}
				{selectedTab === "requests" && (
					<FlatList
						data={friendRequests}
						keyExtractor={(item) => item.id}
						renderItem={renderFriendRequestItem}
						ListEmptyComponent={renderEmptyComponent}
						contentContainerStyle={{ paddingHorizontal: 16 }}
						initialNumToRender={10}
						maxToRenderPerBatch={10}
						windowSize={5}
					/>
				)}

				{/* Friend Suggestions */}
				{selectedTab === "suggestions" && (
					<FlatList
						data={friendSuggestions}
						keyExtractor={(item) => item.id}
						renderItem={renderFriendSuggestionItem}
						ListEmptyComponent={renderEmptyComponent}
						contentContainerStyle={{ paddingHorizontal: 16 }}
						initialNumToRender={10}
						maxToRenderPerBatch={10}
						windowSize={5}
					/>
				)}
			</View>
		</SafeAreaView>
	)
}
