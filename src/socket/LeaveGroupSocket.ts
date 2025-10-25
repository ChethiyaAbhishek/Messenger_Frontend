import { useWebSocket } from "./WebSocketProvider";

export function LeaveGroupSocket() {
  const { sendMessage } = useWebSocket();

  const sendChat = (groupId: number) => {
    sendMessage({
      type: "leave_group",
      groupId
    });
  };

  return sendChat;
}
