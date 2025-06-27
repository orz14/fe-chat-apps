import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import useChat from "@/configs/api/chat";
import { useRoomStore } from "@/stores/useRoomStore";
import { useUserDataStore } from "@/stores/useUserDataStore";
import EachUtils from "@/utils/EachUtils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { useEffect, useState } from "react";
import { monotonicFactory } from "ulid";

export default function ChatRoom() {
  const { room } = useRoomStore();
  const { user } = useUserDataStore();
  const { loadChats } = useChat();
  const ulid = monotonicFactory();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // console.log(ulid(Date.now()));

  async function handleLoadChats(lastSentAt: string | null, lastMessageId: string | null) {
    setLoading(true);
    setMessages([]);
    try {
      const res = await loadChats(room.roomId!, lastSentAt, lastMessageId);
      if (res?.status === 200) {
        setMessages(res.data.chats);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (room?.roomId) {
      handleLoadChats(null, null);
    }
  }, [room?.roomId]);

  function getFormattedTime(time: string | number | Date): string {
    return format(new Date(time), "dd MMM yyyy HH:mm", { locale: id });
  }

  function addMessageToChatRoom(event: {
    content: {
      id: string;
      room_id: string;
      sender_id: number;
      type: string;
      content: string;
      sent_at: string | number | Date;
    };
  }) {
    setMessages([...messages, event.content]);

    // kondisi untuk scroll ke bawah
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-row items-center p-4 font-bold text-white bg-indigo-400 gap-x-2">
          {(room?.roomPicture?.length ?? 0) > 0 ? (
            <Image src={room.roomPicture!} alt={room?.roomName || "Room picture"} width={50} height={50} className="object-cover rounded-full size-10" />
          ) : room?.roomType === "personal" ? (
            <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room?.roomName || "User")}`} alt={room?.roomName || "User Avatar"} width={50} height={50} className="object-cover rounded-full size-10" />
          ) : (
            <div className="size-10 flex justify-center items-center bg-[#ddd] text-indigo-900 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
                <path
                  fillRule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clipRule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
            </div>
          )}
          <div className="leading-tight whitespace-nowrap">
            <span className="block">{room.roomName}</span>
            {room?.roomType === "personal" && (
              <span id="userStatus" className="block text-xs text-indigo-100">
                Online
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full h-full p-4 space-y-1 overflow-x-hidden overflow-y-auto" id="messages">
          <EachUtils
            of={messages}
            render={(message: any) => {
              return message.type === "text" ? (
                <div key={message.id} className={`w-full flex flex-col text-pretty ${message.sender_id === user.id ? "items-end" : "items-start"}`}>
                  <span className={`px-4 py-2 min-w-[150px] max-w-[90%] rounded-t-xl ${message.sender_id === user.id ? "bg-indigo-500 text-white rounded-bl-xl" : "bg-white text-black rounded-br-xl"}`}>{message.content}</span>
                  <span className={`mt-[-1px] py-[2px] px-2 text-[9px] whitespace-nowrap rounded-b-xl ${message.sender_id === user.id ? "bg-indigo-500 text-gray-50" : "bg-white text-gray-400"}`}>{getFormattedTime(message.sent_at)}</span>
                </div>
              ) : (
                "coming soon"
              );
            }}
            isLoading={loading}
            Loader={() => (
              <div className="w-full h-full flex justify-center items-center">
                <SpinnerLoader width="w-[25px]" />
              </div>
            )}
            Empty={() => (
              <div className="w-full h-full flex justify-center items-center">
                <span>No conversation</span>
              </div>
            )}
          />
          <button
            type="button"
            onClick={() =>
              addMessageToChatRoom({
                content: {
                  id: ulid(Date.now()),
                  room_id: room.roomId!,
                  sender_id: user.id!,
                  type: "text",
                  content: "testing",
                  sent_at: Date.now(),
                },
              })
            }
          >
            test
          </button>
        </div>

        <form id="messageForm" className="relative flex flex-row items-center justify-between w-full p-4 bg-indigo-400 gap-x-4" autoComplete="off">
          <div id="backToBottom" className="absolute transition-all duration-300 ease-in-out scale-0 right-5 -top-9">
            <div className="relative">
              <div id="newMessage" className="absolute top-[-1px] left-[-1px] rounded-full bg-rose-500 size-2 hidden"></div>
              <button
                type="button"
                className="p-1 text-black bg-white rounded-full appearance-none cursor-pointer"
                // onClick={() => scrollToBottom(500)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                </svg>
              </button>
            </div>
          </div>

          <button type="button" className="text-white appearance-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <input
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            className="w-full px-4 py-2.5 text-sm text-indigo-900 font-semibold placeholder-gray-400 bg-white rounded-md appearance-none placeholder:text-xs focus:outline-none focus:border-transparent transition-colors duration-300 ease-in-out"
            autoFocus
          />

          <button type="submit" className="text-white appearance-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
