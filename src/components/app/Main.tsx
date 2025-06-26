import Chats from "./Chats";
import { useState } from "react";
import dynamic from "next/dynamic";
import Index from "./room/Index";

const Profile = dynamic(() => import("@/components/app/Profile"));

export default function Main() {
  const [room, setRoom] = useState<any>({
    targetElement: "chat-box",
    roomType: null,
    roomId: null,
    roomName: null,
    roomPicture: null,
  });

  const [sidebar, setSidebar] = useState<string>("chats");

  const renderSidebar = () => {
    switch (sidebar) {
      case "chats":
        return <Chats room={room} setRoom={setRoom} />;
      case "profile":
        return <Profile />;
    }
  };

  const navigate = (target: string) => {
    if (target === sidebar) return;

    setRoom({
      targetElement: "chat-box",
      roomType: null,
      roomId: null,
      roomName: null,
      roomPicture: null,
    });

    switch (target) {
      case "chats":
        setSidebar("chats");
        break;
      case "profile":
        setSidebar("profile");
        break;
    }
  };

  return (
    <section className="flex flex-row h-full overflow-hidden bg-indigo-100">
      {/* Menu */}
      <nav className="flex flex-col items-center justify-between h-full p-4 text-indigo-700 gap-y-4 shrink-0">
        <button type="button" className={`p-2 rounded-full appearance-none ${sidebar === "chats" && "bg-indigo-200"}`} title="Chats" onClick={() => navigate("chats")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button type="button" className={`p-2 rounded-full appearance-none ${sidebar === "profile" && "bg-indigo-200"}`} title="Profile" onClick={() => navigate("profile")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>

      {/* Sidebar */}
      <aside className="h-full w-[360px] overflow-y-auto bg-indigo-200 p-4 text-sm space-y-2 shrink-0">{renderSidebar()}</aside>

      {/* Content */}
      <Index room={room} />
    </section>
  );
}
