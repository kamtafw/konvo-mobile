import { api } from "@/api"
import { ENDPOINTS } from "@/constants/endpoints"
import { LoginSchema, SignupSchema } from "@/lib/formSchema"

export const login = async ({ identifier, password }: LoginSchema) => {
	const response = await api.post(ENDPOINTS.LOGIN, { username: identifier, password })
	return response.data
}

export const signup = async ({ phone_number, email, username, password }: SignupSchema) => {
	const response = await api.post(ENDPOINTS.SIGNUP, { phone_number, email, username, password })
	return response.data
}

export const refreshToken = async (refresh: string) => {
	const response = await api.post(ENDPOINTS.REFRESH_TOKEN, { refresh })
	return response.data
}
