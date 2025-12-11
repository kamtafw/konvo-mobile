import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useNavigation } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import FallbackAvatar from "./FallbackAvatar"

interface TitleProps {
	name: string
	uri: string | null
	isOnline: boolean
	lastSeen: string
}

const Title = React.memo<TitleProps>(({ name, uri, isOnline, lastSeen }) => {
	const navigation = useNavigation()

	return (
		<View className="flex-row items-center px-4 pt-10 pb-2 bg-background border-b border-border">
			<TouchableOpacity onPress={navigation.goBack} className="pr-3">
				<Ionicons name="arrow-back" size={24} className="text-tint" />
			</TouchableOpacity>

			<View className="relative mr-4">
				{uri ? (
					<Image source={{ uri }} className="w-12 h-12 rounded-full mr-4" />
				) : (
					<FallbackAvatar name={name} size={10} />
				)}

				{isOnline && (
					<View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white" />
				)}
			</View>

			<View>
				<Text className="text-xl text-text-secondary font-poppins">{name}</Text>
				{!isOnline && (
					<Text className="text-sm text-offline font-poppins">Last seen {lastSeen}</Text>
				)}
			</View>
		</View>
	)
})
Title.displayName = "Title"

export default Title
