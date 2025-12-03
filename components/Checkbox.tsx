import { Ionicons } from "@expo/vector-icons"
import clsx from "clsx"
import { Pressable, Text, View } from "react-native"

export default function Checkbox({
	checked,
	onChange,
	label,
}: {
	checked: boolean
	onChange: (v: boolean) => void
	label?: string
}) {
	return (
		<Pressable
			className="flex-row items-center active:opacity-60"
			onPress={() => onChange(!checked)}
		>
			<View
				className={clsx(
					"w-5 h-5 rounded-md justify-center items-center mr-2",
					"border",
					checked ? "bg-tint border-tint" : "bg-background border-border"
				)}
			>
				{checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
			</View>

			{label && <Text className="text-text text-sm font-inter">{label}</Text>}
		</Pressable>
	)
}
