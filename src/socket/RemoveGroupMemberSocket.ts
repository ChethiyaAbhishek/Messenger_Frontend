import { useWebSocket } from "./WebSocketProvider";

export function RemoveGroupMemberSocket() {
  const { sendMessage } = useWebSocket();

  const sendChat = (groupId: number, memberId: number) => {
    sendMessage({
      type: "remove_group_member",
      groupId,
      memberId,
    });
  };

  return sendChat;
}
