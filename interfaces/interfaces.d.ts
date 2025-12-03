// "id": 2,
//     "phone_number": "08051517103",
//     "email": "chinani@konvo.com",
//     "username": "OGA",
//     "bio": null,
//     "profile_picture": null,
//     "last_seen": "2025-11-30T09:31:15.300726Z",
//     "is_online": false,

// username should be unique, and either the username for your saved contact appears
// on your friend list or the name you used in saving it to your phone-book (easier identification)

interface Profile {
	id: string
	phone_number: string
	email: string
	username: string
	bio: string | null
	profile_picture: string | null
	last_seen: string
	is_online: boolean
}

interface FriendRequest {
	id: string
	from_user: Profile
	to_user: Profile
	status: "pending" | "accepted" | "rejected"
	created_at: string
}

// API Responses
type ProfileApiResponse = {
	id: number | string
	phone_number: string
	email: string
	username: string
	bio: string | null
	profile_picture: string | null
	last_seen: string
	is_online: boolean
}

type FriendApiResponse = {
	friend: ProfileApiResponse
}

type FriendRequestApiResponse = {
	id: number | string
	from_user: ProfileApiResponse
	to_user: ProfileApiResponse
	status: "pending" | "accepted" | "rejected"
	created_at: string
}
