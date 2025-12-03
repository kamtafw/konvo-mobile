import { useTheme } from "@/providers/ThemeProvider"
import { Feather } from "@expo/vector-icons"
import clsx from "clsx"
import { Platform, TouchableOpacity } from "react-native"

export default function FloatingActionButton({ onPress }: { onPress: () => void }) {
	const { theme } = useTheme()

	return (
		<TouchableOpacity
			onPress={onPress}
			className={clsx(
				"absolute right-8 z-50 bg-tint rounded-full p-4 shadow-lg",
				Platform.OS === "android" ? "bottom-14" : "bottom-18"
			)}
			style={{ elevation: 6 }}
		>
			<Feather name="plus" color="#FFF" size={24} />
		</TouchableOpacity>
	)
}
