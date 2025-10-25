import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, ChatContact, User, WSResponse } from "./Chat";

export function ChatMsgsSocket(contactId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [messages, setMessage] = useState<Chat[]>([]);
  const [contact, setContact] = useState<ChatContact>();

  useEffect(() => {
    
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_single_chat", contactId });

    sendMessage({ type: "get_contact_data", contactId });

    const onMessage = (event: MessageEvent) => {

      const response: WSResponse = JSON.parse(event.data);

      if (response.type === "single_chat") {
        setMessage(response.payload);
      }

      if (response.type === "contact_data") {
        setContact(response.payload);
      }
      
      if (
        response.type === "new_message" &&
        response.payload.toUser.id === contactId
      ) {
        setMessage((prev) => [response.payload, ...prev]);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };

  }, [socket, contactId]);

  return { messages: messages, contact: contact };
}
