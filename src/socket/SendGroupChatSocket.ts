import { useWebSocket } from "./WebSocketProvider";

export function SendGroupChatSocket() {
  const { sendMessage } = useWebSocket();

  const sendChat = (groupId:number, message: string) => {
    sendMessage({
      type: "send_group_message",
      groupId,
      message,
    });
  };

  return sendChat;
}
