import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Protected() {
	return (
		<SafeAreaView className="flex-1 bg-background" edges={["left", "right"]}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</SafeAreaView>
	)
}
