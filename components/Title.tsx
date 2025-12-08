import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useNavigation } from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import FallbackAvatar from "./FallbackAvatar"

interface TitleProps {
	name: string
	uri: string | null
	isConnected: boolean
}

const Title = React.memo<TitleProps>(({ name, uri, isConnected }) => {
	const navigation = useNavigation()

	return (
		<View className="flex-row items-center px-4 pt-10 pb-2 bg-background border-b border-border">
			<TouchableOpacity onPress={navigation.goBack} className="pr-3">
				<Ionicons name="arrow-back" size={24} className="text-tint" />
			</TouchableOpacity>
			{uri ? (
				<Image source={{ uri }} className="w-12 h-12 rounded-full mr-4" />
			) : (
				<View className="mr-4">
					<FallbackAvatar name={name} size={10} />
				</View>
			)}
			<View>
				<Text className="text-xl text-text-secondary font-poppins">{name}</Text>
				<Text className={`text-base ${isConnected ? "text-success" : "text-offline"} font-poppins`}>
					{isConnected ? "● Online" : "● Offline"}
				</Text>
			</View>
		</View>
	)
})
Title.displayName = "Title"

export default Title
