import { useBootstrapApp } from "@/hooks/useBootStrapApp"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { ActivityIndicator, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import "./global.css"

function App() {
	const { ready, error } = useBootstrapApp()

	const [loaded] = useFonts({
		Inter: require("@/assets/fonts/Inter-Regular.ttf"),
		Poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
		"Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
		Satoshi: require("@/assets/fonts/Satoshi-Regular.ttf"),
		SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
	})

	if (!ready || !loaded) {
		return (
			<View>
				<ActivityIndicator size="large" />
				<Text>Loading Konvo...</Text>
			</View>
		)
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center bg-background px-6">
				<Text className="text-error text-lg font-semibold mb-2">Something went wrong</Text>
				<Text className="text-textSecondary text-center">{error}</Text>
			</View>
		)
	}

	return (
		<Stack>
			<Stack.Protected guard={true}>
				{/* <Stack.Screen name="index" options={{ headerShown: false, animation: "none" }} /> */}
				<Stack.Screen name="login" options={{ headerShown: false, animation: "none" }} />
			</Stack.Protected>
		</Stack>
	)
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</SafeAreaProvider>
	)
}
