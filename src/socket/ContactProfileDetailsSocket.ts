import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, ContactProfile, User, WSResponse } from "./Chat";

export function ContactProfileDetailsSocket(contactId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [contactProfileDetails, setContactProfileDetails] =
    useState<ContactProfile>();

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_contact_profile_details", contactId });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);

      if (response.type === "contact_profile_details") {
        setContactProfileDetails(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, contactId]);

  return { contactProfileDetails };
}
