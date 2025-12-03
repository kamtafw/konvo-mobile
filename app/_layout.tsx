import { useBootstrapApp } from "@/hooks/useBootstrapApp"
import { ThemeProvider } from "@/providers/ThemeProvider"
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter"
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins"
import { Stack } from "expo-router"
import { ActivityIndicator, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import "./global.css"

function App() {
	const { isAuthenticated, ready, error } = useBootstrapApp()

	const [loaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		Inter: Inter_600SemiBold,
		Poppins: Poppins_600SemiBold,
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
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(protected)" options={{ headerShown: false, animation: "default" }} />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="signup" options={{ headerShown: false, animation: "none" }} />
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
