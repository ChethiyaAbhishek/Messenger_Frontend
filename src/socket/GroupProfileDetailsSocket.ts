import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, ContactProfile, GroupProfile, User, WSResponse } from "./Chat";

export function GroupProfileDetailsSocket(groupId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [groupProfileDetails, setGroupProfileDetails] =
    useState<GroupProfile>();
  const [groupMembers, setGroupMembers] = useState<ContactProfile[]>();

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_group_profile_details", groupId });
    sendMessage({ type: "get_group_members", groupId });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);

      if (response.type === "group_profile_details") {
        setGroupProfileDetails(response.payload);
      }

      if (response.type === "group_members") {
        setGroupMembers(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, groupId]);

  return { group: groupProfileDetails, members: groupMembers };
}
