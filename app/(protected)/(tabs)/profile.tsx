import { useAuthStore } from "@/stores/authStore"
import { Text, TouchableOpacity, View } from "react-native"

export default function Profile() {
	const logout = useAuthStore((state) => state.logout)

	return (
		<View className="flex-1 items-center justify-center">
			<TouchableOpacity className="bg-tint p-4 rounded-full" onPress={logout}>
				<Text className="text-center text-white font-poppins-bold">LOGOUT</Text>
			</TouchableOpacity>
		</View>
	)
}
