import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, ContactProfile, User, WSResponse } from "./Chat";

export function UserProfileDetailsSocket() {
  const { socket, sendMessage } = useWebSocket();
  const [profileDetails, setProfileDetails] = useState<ContactProfile>();

  useEffect(() => {
    if (!socket) {
      return;
    }

    sendMessage({ type: "get_profile_details" });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);

      if (response.type === "profile_details") {
        setProfileDetails(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return { profileDetails };
}
