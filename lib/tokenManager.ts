let accessToken: string | null = null
let refreshToken: string | null = null

export const TokenManager = {
	getAccessToken: () => accessToken,

	getRefreshToken: () => refreshToken,

	setTokens: (access: string | null, refresh: string | null) => {
		accessToken = access
		refreshToken = refresh
	},

	clearTokens: () => {
		accessToken = null
		refreshToken = null
	},

	updateAccessToken: (access: string) => {
		accessToken = access
	},
}

// For debugging
if (__DEV__) {
	;(global as any).TokenManager = TokenManager
}
