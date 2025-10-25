import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, WSResponse } from "./Chat";

export function SearchListSocket(): Chat[] {
  const { socket, sendMessage } = useWebSocket();
  const [searchList, setSearchList] = useState<Chat[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_search_list" });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "search_list") {
        setSearchList(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return searchList;
}
