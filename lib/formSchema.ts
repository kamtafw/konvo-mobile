import { z } from "zod"

export const loginSchema = z.object({
	identifier: z.string().trim().min(1, "A username, email, or phone number is required."),
	password: z.string().min(6, "Password must be at least 6 characters."),
	remember_me: z.boolean().optional(),
})

export const signupSchema = z
	.object({
		phone_number: z.string().trim().min(1, "Phone number is required."),
		email: z.string().min(1, "Email is required.").email(),
		username: z.string().trim().min(1, "Username is required."),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirm_password: z.string().min(1, "Passwords do not match."),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
	})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
