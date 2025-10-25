import { useWebSocket } from "./WebSocketProvider";

export function AddGroupMemberSocket() {
  const { sendMessage } = useWebSocket();

  const sendChat = (groupId: number, memberId: number) => {
    sendMessage({
      type: "add_group_member",
      groupId,
      memberId,
    });
  };

  return sendChat;
}
