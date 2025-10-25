export interface User {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface Chat {
  id: number;
  friendId: number;
  friendFirstName: string;
  friendLastName: string;
  friendStatus: string;
  savedStatus: string;
  lockedStatus: string;
  contactCountryCode: string;
  contactNumber: string;
  lastMessage: string;
  lastMsgTimeStamp: string;
  lastTimeStamp: string;
  unreadCount: number;
  profileImage?: string;
  fromUser: User;
  toUser: User;
  createdAt: string;
  updatedAt: string;
  status: string;
  message: string;
}

export interface ChatContact {
  contact: User;
  status?: string;
}

export interface Group {
  groupId: number;
  groupName: string;
  lastUserName?: string;
  lastMsg: string;
  lastMsgTime: string;
  unreadCount: number;
  groupProfileImage?: string;
  createdAt?: string;
  lockedStatus?: string;
}

export interface GroupChat {
  id: number;
  createdAt: string;
  updatedAt: string;
  message: string;
  msgType: string;
  status: string;
  fromUser: User;
  toUser?: User;
}

export interface GroupChatPayload {
  chat: GroupChat;
  contactProfileImg?: string;
  contactStatus?: string;
}

export interface ContactProfile {
  contact: User;
  profileImage: string;
  contactStatus?: string;
  contactLockStatus?: string;
  groupStatus?: string;
}

export interface GroupProfile {
  groupName: string;
  profileImg: string;
  memberCount: number;
  createdAt: string;
  lockedStatus: string;
  userStatus: string;
  memberStatus: string;
}

export interface WSRequest {
  type: string;
  fromUserId?: number;
  toUserId?: number;
  message?: string;
}

export interface WSResponse {
  type: string;
  payload: any;
}
