import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { ContactProfile, WSResponse } from "./Chat";

export function LoadAllUsersSocket(groupId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [allUsers, setAllUsers] = useState<ContactProfile[]>();

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_all_users", groupId });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);

      if (response.type === "all_users") {
        setAllUsers(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, groupId]);

  return { allUsers };
}
