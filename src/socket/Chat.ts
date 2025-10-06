export interface User {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  profileImage?: string;
  createdAt:string;
  updatedAt:string;
  status:string;
}

export interface Chat {
  id:number;
  friendId: number;
  friendFirstName:string;
  friendLastName:string;
  friendStatus: string;
  savedStatus:string;
  contactCountryCode:string;
  contactNumber: string;
  lastMessage: string;
  lastMsgTimeStamp:string;
  lastTimeStamp:string;
  unreadCount:number;
  profileImage?:string;
  fromUser: User;
  toUser: User;
  createdAt: string;
  updatedAt: string;
  status: string;
  message:string;
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
