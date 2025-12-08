import { Text, View } from "react-native"

const COLORS = [
	"#F06292",
	"#BA68C8",
	"#9575CD",
	"#7986CB",
	"#64B5F6",
	"#4FC3F7",
	"#4DB6AC",
	"#81C784",
	"#AED581",
	"#FFD54F",
	"#FFB74D",
	"#FF8A65",
]

function getColorFromName(name: string) {
	let hash = 0
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash)
	}
	return COLORS[Math.abs(hash) % COLORS.length]
}

export default function FallbackAvatar({ name, size = 12 }: { name: string; size?: number }) {
	const letter = name?.charAt(0)?.toUpperCase() || "?"
	const bg = getColorFromName(name || "Unknown")

	return (
		<View
			style={{ backgroundColor: bg }}
			className={`w-${size} h-${size} rounded-full justify-center items-center`}
		>
			<Text className="text-white text-2xl font-poppins-semibold">{letter}</Text>
		</View>
	)
}
