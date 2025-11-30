import { useFonts } from "expo-font"
import { Text, View } from "react-native"
import "./global.css"

export default function Index() {
	const [loaded] = useFonts({
		Inter: require("@/assets/fonts/Inter-Regular.ttf"),
		Poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
		"Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
		Satoshi: require("@/assets/fonts/Satoshi-Regular.ttf"),
		SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
	})

	if (!loaded) return

	return (
		<View className="bg-background flex-1 items-center justify-center">
			<Text className="font-poppins text-xl text-success">
				Edit app/INDEX.tsx to edit this screen.
			</Text>
		</View>
	)
}
