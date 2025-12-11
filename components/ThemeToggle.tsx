import { useTheme } from "@/providers/ThemeProvider"
import { Feather } from "@expo/vector-icons"
import { useEffect } from "react"
import { Pressable, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const Icon = ({ name, isDark }: { name: any; isDark: boolean }) => {
	return (
		<View className="w-8 h-8 relative z-50 rounded-full items-center justify-center flex flex-row">
			<Feather name={name} size={16} color={`${isDark ? "white" : "black"}`} />
		</View>
	)
}

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()
	const isDark = theme === "dark"
	const translateX = useSharedValue(isDark ? 46 : 3.5)

	useEffect(() => {
		translateX.value = withSpring(isDark ? 38 : 3.5, {
			damping: 15,
			stiffness: 150,
		})
	}, [isDark, translateX])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		}
	})

	return (
		<Pressable
			onPress={toggleTheme}
			className="w-20 h-10 p-1 bg-tint relative flex-row rounded-full items-center justify-between"
		>
			<Icon name="sun" isDark={isDark} />
			<Icon name="moon" isDark={isDark} />
			<Animated.View
				style={[animatedStyle]}
				className="w-8 h-8 bg-background rounded-full items-center justify-center flex flex-row absolute"
			/>
		</Pressable>
	)
}
