import Checkbox from "@/components/Checkbox"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import { loginSchema, LoginSchema } from "@/lib/formSchema"
import { useAuthStore } from "@/stores/authStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import { useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Login() {
	const identifierRef = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)

	const loginUser = useAuthStore((state) => state.login)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginSchema) => {
		try {
			await loginUser(data)
		} catch (error) {
			console.error("Login error:", error)
		}
	}

	return (
		<SafeAreaView className="flex-1 px-8 pt-12 bg-background">
			{/* Logo */}
			<View className="flex-row items-center mb-20">
				<View className="w-10 h-10 mr-3 relative">
					<View className="w-10 h-10 bg-tint rounded-lg absolute top-0 left-0" />
					<View className="w-10 h-10 bg-tint-light rounded-lg absolute top-2 left-2" />
				</View>
				<Text className="text-3xl text-text font-inter-bold">Konvo</Text>
			</View>

			{/* Title */}
			<View className="h-[30%] justify-center items-center">
				<Text className="text-5xl text-text mb-2 font-inter-bold">Welcome Back !</Text>
				<Text className="text-3xl text-muted font-inter">Please enter your detail</Text>
			</View>

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-1">
					<View className="mb-12">
						{/* Identifier input */}
						<Controller
							control={control}
							name="identifier"
							render={({ field }) => (
								<Input
									placeholder="Username, Email, or Phone Number"
									{...field}
									error={errors.identifier?.message}
									autoCapitalize="none"
									keyboardType="name-phone-pad"
									returnKeyType="next"
									blurOnSubmit={false}
									ref={identifierRef}
									onSubmitEditing={() => passwordRef.current?.focus()}
								/>
							)}
						/>

						{/* Password input */}
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<PasswordInput
									placeholder="Password"
									{...field}
									error={errors.password?.message}
									returnKeyType="done"
									ref={passwordRef}
								/>
							)}
						/>

						{/* Remember + Forgot */}
						<View className="flex-row justify-between items-center mb-6">
							<Controller
								control={control}
								name="remember_me"
								render={({ field: { onChange, value } }) => (
									<Checkbox checked={Boolean(value)} onChange={onChange} label="Remember me" />
								)}
							/>
							<TouchableOpacity>
								<Text className="text-text text-sm font-inter">Forgot Password?</Text>
							</TouchableOpacity>
						</View>

						{/* Button */}
						<TouchableOpacity
							className={`w-full h-14 bg-tint rounded-full justify-center items-center ${isSubmitting && "opacity-60"}`}
							onPress={handleSubmit(onSubmit)}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<ActivityIndicator size="small" color="black" />
							) : (
								<Text className="text-white text-base font-inter-bold">Log In</Text>
							)}
						</TouchableOpacity>
					</View>

					{/* Footer */}
					<View className="py-8 items-center">
						<View className="flex-row">
							<Text className="text-text text-base font-inter">Don't have an account? </Text>
							<TouchableOpacity onPress={() => router.push({ pathname: "/signup" })}>
								<Text className="text-text text-base font-inter-bold underline">Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
