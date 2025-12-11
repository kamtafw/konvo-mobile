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

interface Message {
	id: string | null
	message: string
	sender: {
		id: string
		username: string
		profile_picture: string | null
	}
	recipient_id: string
	temp_id: string | null
	timestamp: string
	is_read: boolean
	status: "sending" | "sent" | "failed"
}

interface Chat {
	friend: {
		id: string
		username: string
		profile_picture: string | null
		is_online: boolean
		last_seen: string
	}
	last_message: {
		id: string
		sender_id: string
		recipient_id: string
		message: string
		timestamp: string
		is_read: boolean
	}
	unread_count: number
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

type MessageApiResponse = {
	id: number
	sender: {
		id: number
		username: string
		profile_picture: string | null
	}
	recipient: number
	message: string
	timestamp: string
	is_read: boolean
	temp_id: string
	type?: string
}

type ChatApiResponse = {
	friend: {
		id: number
		username: string
		profile_picture: string | null
		is_online: boolean
		last_seen: string
	}
	last_message: {
		id: number
		sender: {
			id: number
			username: string
			profile_picture: string | null
		}
		recipient: number
		message: string
		timestamp: string
		is_read: boolean
	}
	unread_count: number
}
