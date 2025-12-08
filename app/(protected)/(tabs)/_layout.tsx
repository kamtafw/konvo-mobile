import { useTheme } from "@/providers/ThemeProvider"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Layout() {
	const { top, bottom } = useSafeAreaInsets()
	const { theme } = useTheme()

	return (
		<Tabs
			screenOptions={{
				headerTitleAlign: "center",
				headerTitleStyle: { fontFamily: "Inter", color: theme === "dark" ? "#F9FAFB" : "#111827" },
				headerStyle: {
					backgroundColor: theme === "dark" ? "#0F172A" : "#FFF",
					borderBottomWidth: 0.5,
					borderBottomColor: theme === "dark" ? "#334155" : "#E5E7EB",
					height: 60 + top,
				},
				tabBarActiveTintColor: theme === "dark" ? "#5C8FE8" : "#004AAD",
				tabBarStyle: {
					backgroundColor: theme === "dark" ? "#0F172A" : "#FFF",
					borderTopWidth: 0.5,
					borderTopColor: theme === "dark" ? "#334155" : "#E5E7EB",
					height: 60 + bottom,
					paddingBottom: bottom,
				},
				tabBarLabelStyle: { fontSize: 10, fontFamily: "Poppins" },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Chats",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "chatbubbles-sharp" : "chatbubbles-outline"}
							size={focused ? 24 : 20}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="friends"
				options={{
					title: "Friends",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "people-sharp" : "people-outline"}
							size={focused ? 24 : 20}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "person-circle-sharp" : "person-circle-outline"}
							size={focused ? 24 : 20}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
