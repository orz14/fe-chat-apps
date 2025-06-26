import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import dynamic from "next/dynamic";
import { useRoomStore } from "@/stores/useRoomStore";

const ChatRoom = dynamic(() => import("@/components/app/room/ChatRoom"));

export default function Index() {
  const { room } = useRoomStore();
  const [element, setElement] = useState<{ target: string; roomId: string | null }>({
    target: "chat-box",
    roomId: null,
  });

  const renderRoom = () => {
    switch (element.target) {
      case "chat-box":
        return <ChatBox />;
      case "chat-room":
        return <ChatRoom />;
    }
  };

  useEffect(() => {
    if (room?.targetElement === "chat-box") {
      navigate("chat-box");
    } else if (room?.targetElement === "chat-room") {
      navigate("chat-room");
    }
  }, [room]);

  const navigate = (target: string) => {
    if (target === element.target && element.roomId === room?.roomId) return;

    switch (target) {
      case "chat-box":
        setElement({
          target: "chat-box",
          roomId: null,
        });
        break;
      case "chat-room":
        setElement({
          target: "chat-room",
          roomId: room?.roomId,
        });
        break;
    }
  };

  return renderRoom();
}
