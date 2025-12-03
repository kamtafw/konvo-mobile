import { z } from "zod"

export const loginSchema = z.object({
	identifier: z
		.string({ required_error: "A username, email, or phone number is required." })
		.trim(),
	password: z
		.string({ required_error: "Password is required." })
		.min(6, "Password must be at least 6 characters."),
	remember_me: z.boolean().optional(),
})

export const signupSchema = z
	.object({
		phone_number: z.string({ required_error: "Phone number is required." }).trim(),
		email: z.string({ required_error: "Email is required." }).email(),
		username: z.string({ required_error: "Username is required." }).trim(),
		password: z
			.string({ required_error: "Password is required." })
			.min(6, "Password must be at least 6 characters"),
		confirm_password: z.string({ required_error: "Passwords do not match." }),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
	})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
