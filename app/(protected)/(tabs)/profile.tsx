import FallbackAvatar from "@/components/FallbackAvatar"
import ThemeToggle from "@/components/ThemeToggle"
import { useTheme } from "@/providers/ThemeProvider"
import { useAuthStore } from "@/stores/authStore"
import { Feather } from "@expo/vector-icons"
import { Image } from "expo-image"
import { cssInterop } from "nativewind"
import { useState } from "react"
import { Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// const InfoRow = ({ icon, label, value, link, last = false }: any) => {
// 	return (
// 		<Pressable
// 			onPress={() => link && Linking.openURL(link)}
// 			className={clsx("px-4 py-3 flex-row items-center border-border gap-4", !last && "border-b")}
// 			style={({ pressed }) => [pressed && { opacity: 0.6 }]}
// 		>
// 			<Feather name={icon} size={18} className="text-muted" />
// 			<Text className="flex-1 text-sm text-muted">{label}</Text>
// 			<Text className="text-sm text-text">{value}</Text>
// 		</Pressable>
// 	)
// }

cssInterop(Feather, {
	className: {
		target: "style",
		nativeStyleToProp: { height: "size", width: "size" },
	},
})

export default function Profile() {
	const { theme } = useTheme()
	const [notifications, setNotifications] = useState(false)
	const logout = useAuthStore((state) => state.logout)
	const profile = useAuthStore((state) => state.profile)

	if (!profile) return null

	const uri = profile.profile_picture

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
			<View className="px-4 pt-5 pb-2">
				{/* Avatar */}
				<View className="items-center justify-center mb-3">
					<View className="relative">
						{uri ? (
							<Image source={{ uri }} className="w-20 h-20 rounded-full" />
						) : (
							<FallbackAvatar name={profile.username} is_online={profile.is_online} size={20} />
						)}

						<TouchableOpacity className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-tint border-2 border-background justify-center items-center">
							<Feather name="edit-3" size={11} color="white" className="text-white text-bold" />
						</TouchableOpacity>
					</View>
				</View>

				{/* Username & Status */}
				<View className="items-center justify-center mb-5">
					<Text className="text-xl text-text font-poppins-bold">{profile.username}</Text>
					<View className="flex-row items-center gap-1">
						<View className="w-3 h-3 rounded-full bg-success border-2 border-background" />
						<Text className="text-sm text-text-secondary font-poppins">Online</Text>
					</View>
				</View>

				{/* About Me */}
				<View className="">
					<Text className="bg-surface px-2 py-2 text-base text-offline font-poppins">About Me</Text>
					<View className="flex-row items-center py-3 border-b border-border">
						<Feather name="user" size={20} className="text-muted p-2" />
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">@{profile.username}</Text>
							<Text className="text-sm text-muted font-poppins">Username</Text>
						</View>
					</View>

					<View className="flex-row items-center py-3 border-b border-border">
						<Feather name="mail" size={20} className="text-muted p-2" />
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">{profile.email}</Text>
							<Text className="text-sm text-muted font-poppins">E-mail Address</Text>
						</View>
					</View>

					<View className="flex-row items-center py-3 border-b border-border">
						<Feather name="phone" size={20} className="text-muted p-2" />
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">{profile.phone_number}</Text>
							<Text className="text-sm text-muted font-poppins">Phone Number</Text>
						</View>
					</View>
				</View>

				{/* Settings */}
				<View className="mb-5">
					<Text className="bg-surface px-2 py-2 text-base text-offline font-poppins">Settings</Text>
					<View className="flex-row items-center py-3 border-b border-border">
						<Feather name="globe" size={20} className="text-muted p-2" />
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">English</Text>
							<Text className="text-sm text-muted font-poppins">Language</Text>
						</View>
					</View>

					<View className="flex-row items-center py-3 border-b border-border">
						<Feather
							name={notifications ? "volume-2" : "volume-x"}
							size={20}
							className="text-muted p-2"
						/>
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">
								{notifications ? "Sound" : "Silent"} mode
							</Text>
							<Text className="text-sm text-muted font-poppins">Notifications & Message</Text>
						</View>
						<Switch
							value={notifications}
							onValueChange={setNotifications}
							trackColor={{ false: "#9ca3af", true: "#004AAD" }}
							style={{
								marginVertical: -12,
								transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
							}}
						/>
					</View>

					<View className="flex-row items-center py-3 border-b border-border">
						<Feather
							name={theme === "light" ? "sun" : "moon"}
							size={20}
							className="text-muted p-2"
						/>
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">
								{theme === "light" ? "Light" : "Dark"} Mode
							</Text>
							<Text className="text-sm text-muted font-poppins">Theme</Text>
						</View>
						<ThemeToggle />
					</View>

					<View className="flex-row items-center py-3 border-b border-border">
						<Feather name="sliders" size={20} className="text-muted p-2" />
						<View className="flex-1 ml-2">
							<Text className="text-base text-text font-poppins">
								Camera, Location, & Microphone
							</Text>
							<Text className="text-sm text-muted font-poppins">Device Permissions</Text>
						</View>
					</View>
				</View>

				{/* Logout Button */}
				<View className="flex-row items-center justify-between py-8">
					<TouchableOpacity className="flex-row items-center" onPress={logout}>
						<Feather name="log-out" size={20} className="p-2 rotate-180 text-error" />
						<Text className="text-lg text-error font-poppins">Log Out</Text>
					</TouchableOpacity>
					<TouchableOpacity className="flex-row items-center" onPress={() => {}}>
						<Feather name="share-2" size={20} className="p-2 text-muted" />
						<Text className="text-lg text-text font-poppins">Share App</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}
