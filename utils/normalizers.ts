export function normalizeProfile(profile: ProfileApiResponse): Profile {
	return {
		id: String(profile.id),
		phone_number: profile.phone_number,
		email: profile.email,
		username: profile.username,
		bio: profile.bio,
		profile_picture: profile.profile_picture,
		last_seen: profile.last_seen,
		is_online: Boolean(profile.is_online),
	}
}

export function normalizeFriend(friend: FriendApiResponse): Profile {
	return {
		id: String(friend.friend.id),
		phone_number: friend.friend.phone_number,
		email: friend.friend.email,
		username: friend.friend.username,
		bio: friend.friend.bio,
		profile_picture: friend.friend.profile_picture,
		last_seen: friend.friend.last_seen,
		is_online: Boolean(friend.friend.is_online),
	}
}

export function normalizeFriendRequest(friendRequest: FriendRequestApiResponse): FriendRequest {
	return {
		id: String(friendRequest.id),
		from_user: normalizeProfile(friendRequest.from_user),
		to_user: normalizeProfile(friendRequest.to_user),
		status: friendRequest.status,
		created_at: friendRequest.created_at,
	}
}

export function normalizeMessage(message: MessageApiResponse): Message {
	return {
		id: String(message.id),
		sender: {
			id: String(message.sender.id),
			username: message.sender.username,
			profile_picture: message.sender.profile_picture,
		},
		recipient_id: String(message.recipient),
		temp_id: message.temp_id,
		message: message.message,
		timestamp: message.timestamp,
		is_read: message.is_read,
		status: "sent",
	}
}

export function normalizeChat(chat: ChatApiResponse): Chat {
	return {
		friend: {
			id: String(chat.friend.id),
			username: chat.friend.username,
			profile_picture: chat.friend.profile_picture,
			is_online: Boolean(chat.friend.is_online),
			last_seen: chat.friend.last_seen,
		},
		last_message: {
			id: String(chat.last_message.id),
			sender_id: String(chat.last_message.sender.id),
			recipient_id: String(chat.last_message.recipient),
			message: chat.last_message.message,
			timestamp: chat.last_message.timestamp,
			is_read: Boolean(chat.last_message.is_read),
		},
		unread_count: chat.unread_count,
	}
}
