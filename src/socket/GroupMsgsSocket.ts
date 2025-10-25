import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Group, GroupChat, GroupChatPayload, WSResponse } from "./Chat";

export function GroupMsgsSocket(groupId: number) {
    const { socket, sendMessage } = useWebSocket();
    const [messages, setMessage] = useState<GroupChatPayload[]>([]);
    const [group, setGroup] = useState<Group>();

    useEffect(() => {

        if (!socket) {
            return;
        }

        sendMessage({ type: "get_group_chat", groupId });

        sendMessage({ type: "get_group_data", groupId });

        const onMessage = (event: MessageEvent) => {

            const response: WSResponse = JSON.parse(event.data);

            if (response.type === "group_chat") {
                setMessage(response.payload);
            }

            if (response.type === "group_data") {
                setGroup(response.payload);
            }

            if (response.type === "new_group_message") {
                setMessage((prev) => [response.payload, ...prev]);
            }
        };

        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        };

    }, [socket, groupId]);

    return { messages: messages, group: group };
}
