import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import { signupSchema, SignupSchema } from "@/lib/formSchema"
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

export default function Signup() {
	const phoneRef = useRef<TextInput>(null)
	const emailRef = useRef<TextInput>(null)
	const usernameRef = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)
	const confirmRef = useRef<TextInput>(null)

	const signupUser = useAuthStore((state) => state.signup)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	})

	const onSubmit = async (data: SignupSchema) => {
		try {
			await signupUser(data)
		} catch (error) {
			console.error("Signup error:", error)
		}
	}

	return (
		<SafeAreaView className="flex-1 px-8 pt-12 bg-background">
			{/* Logo */}
			<View className="flex-row items-center mb-10">
				<View className="w-10 h-10 mr-3 relative">
					<View className="w-10 h-10 bg-tint rounded-lg absolute top-0 left-0" />
					<View className="w-10 h-10 bg-tint-light rounded-lg absolute top-2 left-2" />
				</View>
				<Text className="text-3xl text-text font-inter-bold">Konvo</Text>
			</View>

			{/* Title */}
			<View className="h-[15%] justify-center items-center">
				<Text className="text-5xl text-text mb-2 font-inter-bold">Hi! Welcome</Text>
				<Text className="text-3xl text-muted font-inter">Please register in below</Text>
			</View>

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-1">
					<View className="flex-1 mb-12">
						{/* Phone Number input */}
						<Controller
							control={control}
							name="phone_number"
							render={({ field }) => (
								<Input
									placeholder="Phone Number"
									{...field}
									error={errors.phone_number?.message}
									keyboardType="phone-pad"
									returnKeyType="next"
									blurOnSubmit={false}
									ref={phoneRef}
									onSubmitEditing={() => emailRef.current?.focus()}
								/>
							)}
						/>

						{/* Email input */}
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<Input
									placeholder="Email"
									{...field}
									error={errors.email?.message}
									keyboardType="email-address"
									returnKeyType="next"
									blurOnSubmit={false}
									ref={emailRef}
									onSubmitEditing={() => usernameRef.current?.focus()}
								/>
							)}
						/>

						{/* Username input */}
						<Controller
							control={control}
							name="username"
							render={({ field }) => (
								<Input
									placeholder="Username"
									{...field}
									error={errors.username?.message}
									autoCapitalize="none"
									returnKeyType="next"
									blurOnSubmit={false}
									ref={usernameRef}
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
									returnKeyType="next"
									blurOnSubmit={false}
									ref={passwordRef}
									onSubmitEditing={() => confirmRef.current?.focus()}
								/>
							)}
						/>

						{/* Confirm Password input */}
						<Controller
							control={control}
							name="confirm_password"
							render={({ field }) => (
								<PasswordInput
									placeholder="Confirm Password"
									{...field}
									error={errors.confirm_password?.message}
									returnKeyType="done"
									ref={confirmRef}
								/>
							)}
						/>

						{/* Button */}
						<TouchableOpacity
							className={`w-full h-14 bg-tint rounded-full justify-center items-center mb-6 ${isSubmitting && "opacity-60"}`}
							onPress={handleSubmit(onSubmit)}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<ActivityIndicator size="small" color="black" />
							) : (
								<Text className="text-white text-base font-inter-bold">Sign Up</Text>
							)}
						</TouchableOpacity>

						{/* Link */}
						<View className="items-center">
							<View className="flex-row">
								<Text className="text-text text-base font-inter">Have an account? </Text>
								<TouchableOpacity onPress={() => router.push({ pathname: "/login" })}>
									<Text className="text-text text-base font-inter-bold underline">Log In</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Footer */}
					<View className="pt-8 items-center">
						<View className="flex-col items-center">
							<Text className="text-text text-base font-inter">
								We need permission for the service you use
							</Text>
							<TouchableOpacity>
								<Text className="text-text text-base font-inter-bold underline">Learn More</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
