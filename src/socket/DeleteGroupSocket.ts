import { useWebSocket } from "./WebSocketProvider";

export function DeleteGroupSocket() {
  const { sendMessage } = useWebSocket();

  const sendChat = (groupId: number) => {
    sendMessage({ type: "delete_group", groupId });
  };

  return sendChat;
}


