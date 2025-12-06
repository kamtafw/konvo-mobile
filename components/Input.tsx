import { Ionicons } from "@expo/vector-icons"
import { clsx } from "clsx"
import { cssInterop } from "nativewind"
import { forwardRef } from "react"
import { Text, TextInput, View } from "react-native"

cssInterop(Ionicons, {
	className: {
		target: "style",
		nativeStyleToProp: { height: "size", width: "size" },
	},
})

const Input = forwardRef(({ value, onChange, onBlur, error, className, ...props }: any, ref) => {
	return (
		<View className="mb-3 w-full">
			<View className={clsx("w-full bg-surface rounded-full", error && "border border-error")}>
				<TextInput
					ref={ref}
					value={value}
					onChangeText={onChange}
					onBlur={onBlur}
					className={clsx("h-14 px-4 bg-transparent text-text text-base font-poppins", className)}
					placeholderTextColor="#8a8a8a"
					{...props}
				/>
			</View>

			{error && <Text className="text-red-400 text-sm font-poppins mt-1 mb-3">{error}</Text>}
		</View>
	)
})
Input.displayName = "Input"

export default Input
