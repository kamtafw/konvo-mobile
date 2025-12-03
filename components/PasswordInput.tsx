import { Ionicons } from "@expo/vector-icons"
import clsx from "clsx"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

export default function PasswordInput({ value, onChange, onBlur, error, ...props }: any) {
	const [show, setShow] = useState(false)

	return (
		<View className="mb-5 w-full">
			<View
				className={clsx(
					"flex-row w-full bg-surface rounded-full items-center justify-between",
					error && "border border-error "
				)}
			>
				<TextInput
					value={value}
					onChangeText={onChange}
					onBlur={onBlur}
					secureTextEntry={!show}
					className="flex-1 h-14 px-4 py-3 bg-transparent text-text text-base font-poppins"
					placeholderTextColor="#8a8a8a"
					{...props}
				/>

				<TouchableOpacity className="px-4" onPress={() => setShow(!show)}>
					<Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color="#C7C7E5" />
				</TouchableOpacity>
			</View>

			{error && <Text className="text-red-400 text-sm font-poppins mt-1 mb-3">{error}</Text>}
		</View>
	)
}
