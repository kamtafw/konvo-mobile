import Constants from "expo-constants"

const getLocalIP = (fallback = "0.0.0.0"): string => {
	const debuggerHost = Constants.expoConfig?.hostUri

	if (debuggerHost) {
		const ip = debuggerHost.split(":")[0]
		return ip
	}

	console.log("Using fallback IP:", fallback)
	return fallback
}

export const ENDPOINTS = {
	IPv4: getLocalIP(),

	SIGNUP: "accounts/signup/",
	LOGIN: "accounts/login/",
	REFRESH_TOKEN: "accounts/token/refresh/",
	VERIFY_TOKEN: "accounts/token/verify/",

	MESSAGE_HISTORY: (id: string) => `chat/${id}/`,

	LIST_FRIENDS: "friends/",
	SEND_REQUEST: "friends/request/",
	LIST_REQUESTS: "friends/requests/",
	LIST_SUGGESTIONS: "friends/suggestions/",
	ACCEPT_REQUEST: (id: string) => `friends/accept/${id}/`,
	REJECT_REQUEST: (id: string) => `friends/reject/${id}/`,
}
