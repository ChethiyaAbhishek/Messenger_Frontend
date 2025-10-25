import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Group, WSResponse } from "./Chat";

export function GroupListSocket(): Group[] {
  const { socket, sendMessage } = useWebSocket();
  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_group_list" });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "group_list") {
        setGroupList(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return groupList;
}
