import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import useChat from "@/configs/api/chat";
import { useToast } from "@/hooks/use-toast";
import echo from "@/lib/echo";
import { useLoadingRoomStore } from "@/stores/useLoadingRoomStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useUserDataStore } from "@/stores/useUserDataStore";
import EachUtils from "@/utils/EachUtils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { monotonicFactory } from "ulid";

export default function ChatRoom() {
  const { toast } = useToast();
  const { room, setRoom } = useRoomStore();
  const { user } = useUserDataStore();
  const { loadingRoom, setLoadingRoom } = useLoadingRoomStore();
  const { loadChats, sendText } = useChat();
  const ulid = monotonicFactory();
  const [messages, setMessages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputTextRef = useRef<HTMLInputElement | null>(null);
  const backToTopRef = useRef<HTMLButtonElement | null>(null);
  const newMessageRef = useRef<HTMLDivElement | null>(null);

  // Input autofocus
  useEffect(() => {
    inputTextRef.current?.focus();
  }, [room]);

  // Load chats & listen room
  useEffect(() => {
    let channel: any = null;

    if (room?.roomId) {
      setLoadingRoom(true);
      setMessages([]);
      newMessageRef.current?.classList.add("hidden");
      backToTopRef.current?.classList.remove("!scale-100");
      inputTextRef.current!.value = "";

      (async () => {
        await handleLoadChats(null, null);
        scrollToBottom("auto");
      })();

      const roomName = `room.${room.roomId}`;
      channel = echo?.private(roomName);

      if (!channel) return;

      channel
        ?.listen(".message.sent", (e: any) => {
          if (!e?.content) return;
          if (e.content.sender_id === user.id) return;
          addMessageToChatRoom(e.content);
          newMessageRef.current?.classList.remove("hidden");
        })
        .error((err: any) => {
          if (err.status === 403) {
            setRoom({
              targetElement: "chat-box",
              roomType: null,
              roomId: null,
              roomName: null,
              roomPicture: null,
              userId: null,
              isOnline: null,
            });

            toast({
              variant: "destructive",
              description: "Anda tidak memiliki akses.",
            });
          } else {
            toast({
              variant: "destructive",
              description: "Terjadi kesalahan.",
            });
          }
        });
    }

    return () => {
      channel?.stopListening(".message.sent");
      echo?.leave(`room.${room?.roomId}`);
    };
  }, [room?.roomId]);

  async function handleLoadChats(lastSentAt: string | null, lastMessageId: string | null) {
    setLoadingRoom(true);
    try {
      const resChats = await loadChats(room.roomId!, lastSentAt, lastMessageId);
      if (resChats?.status === 200) {
        setMessages(resChats.data.chats);
      }
    } catch (err) {
      if (err.status === 403) {
        setRoom({
          targetElement: "chat-box",
          roomType: null,
          roomId: null,
          roomName: null,
          roomPicture: null,
          userId: null,
          isOnline: null,
        });

        toast({
          variant: "destructive",
          description: "Anda tidak memiliki akses.",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Terjadi kesalahan.",
        });
      }
    } finally {
      setLoadingRoom(false);
    }
  }

  function getFormattedTime(time: string | number | Date): string {
    return format(new Date(time), "dd MMM yyyy HH:mm", { locale: id });
  }

  function getDistanceFromBottom(el: HTMLElement) {
    return el?.scrollHeight - (el?.scrollTop + el?.clientHeight);
  }

  function addMessageToChatRoom(event: { id: string; room_id: string; sender_id: number; sender_username: string; type: string; content: string; sent_at: string | number | Date }) {
    const lastMessageHeightBefore = getLastMessageHeight() || 60;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: event.id,
        room_id: event.room_id,
        sender_id: event.sender_id,
        sender_username: event.sender_username,
        type: event.type,
        content: event.content,
        sent_at: event.sent_at,
      },
    ]);

    requestAnimationFrame(() => {
      setTimeout(() => {
        if (event.sender_id === user.id) {
          scrollToBottom("smooth");
          return;
        } else {
          const messagesElement = containerRef.current;

          if (messagesElement) {
            const distanceFromBottom = getDistanceFromBottom(messagesElement);
            const lastMessageHeightAfter = (getLastMessageHeight() || 60) + 20;

            if (distanceFromBottom === 0 || distanceFromBottom <= lastMessageHeightBefore + lastMessageHeightAfter) {
              scrollToBottom("smooth");
            }
          }
        }
      }, 20);
    });
  }

  async function handleSendText(e: React.FormEvent) {
    e.preventDefault();

    const value = inputTextRef.current!.value;
    if (value && value.trim() !== "" && value !== null && value !== undefined) {
      const event = {
        id: ulid(Date.now()),
        room_id: room.roomId!,
        sender_id: user.id!,
        sender_username: user.username!,
        type: "text",
        content: value,
        sent_at: Date.now(),
      };

      addMessageToChatRoom(event);
      newMessageRef.current?.classList.add("hidden");
      inputTextRef.current!.value = "";
      inputTextRef.current!.focus();

      try {
        await sendText(event.id, event.room_id, event.type, event.content);
      } catch (err: any) {
        handleDeleteMessage(event.id);
        toast({
          variant: "destructive",
          description: "Gagal mengirim pesan.",
        });
      }
    }
  }

  function handleDeleteMessage(id: string) {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    scrollToBottom("smooth");
  }

  function scrollToBottom(behavior: "smooth" | "auto") {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({
          behavior,
          block: "end",
        });
      }, 20);
    });
  }

  function getLastMessageHeight(): number {
    const messagesElement = containerRef.current;
    if (!messagesElement) return 0;

    const chatDivs = messagesElement.querySelectorAll("div.chat");
    const lastChat = chatDivs[chatDivs.length - 1] as HTMLElement | undefined;
    return lastChat ? lastChat.offsetHeight : 0;
  }

  function isNextMessageDifferent(message: { sender_id: number; sent_at: string | number | Date }, index: number) {
    const currentTime = getFormattedTime(message.sent_at);
    const currentSender = message.sender_id;

    const nextMessage = messages[index + 1];
    const nextTime = nextMessage ? getFormattedTime(nextMessage.sent_at) : null;
    const nextSender = nextMessage ? nextMessage.sender_id : null;

    return !nextMessage || currentSender !== nextSender || currentTime !== nextTime;
  }

  function getExtension(filePath: string) {
    return filePath.split(".").pop()?.toLowerCase() ?? "";
  }

  const messagesElement = containerRef.current;
  if (messagesElement) {
    messagesElement.addEventListener("scroll", function () {
      const lastMessageHeight = (getLastMessageHeight() || 60) + 16;
      const distanceFromBottom = getDistanceFromBottom(messagesElement);

      if (distanceFromBottom <= lastMessageHeight) {
        backToTopRef.current?.classList.remove("!scale-100");
      } else {
        backToTopRef.current?.classList.add("!scale-100");
      }
    });
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-row items-center p-4 font-bold text-white bg-indigo-400 gap-x-2 select-none">
          {(room?.roomPicture?.length ?? 0) > 0 ? (
            <Image src={room.roomPicture!} alt={room?.roomName || "Room picture"} width={50} height={50} className="object-cover rounded-full size-10 pointer-events-none" />
          ) : room?.roomType === "personal" ? (
            <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room?.roomName || "User")}`} alt={room?.roomName || "User Avatar"} width={50} height={50} className="object-cover rounded-full size-10 pointer-events-none" />
          ) : (
            <div className="size-10 flex justify-center items-center bg-indigo-100 text-indigo-900 rounded-full pointer-events-none">
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
          <div className="leading-tight whitespace-nowrap pointer-events-none">
            <span className="block">{room.roomName}</span>
            {room?.roomType === "personal" && room?.isOnline && (
              <span id="userStatus" className="block text-xs text-indigo-100">
                Online
              </span>
            )}
          </div>
        </div>

        <div ref={containerRef} className="flex flex-col w-full h-full pt-4 px-4 space-y-1 overflow-x-hidden overflow-y-auto">
          <EachUtils
            of={messages}
            render={(message: any, index: number) => {
              const showTimestamp = isNextMessageDifferent(message, index);
              const isOwnMessage = message.sender_id === user.id;
              const currentTime = getFormattedTime(message.sent_at);

              const wrapperClass = `w-full flex text-pretty chat ${isOwnMessage ? "justify-end" : "justify-start"}`;
              const bubbleColorClass = isOwnMessage ? "bg-indigo-500 text-white" : "bg-white text-black";
              const chatClass = `flex flex-col rounded-xl overflow-hidden ${bubbleColorClass}`;
              const dataClass = `w-max py-[2px] px-2 text-[9px] font-semibold whitespace-nowrap ${isOwnMessage ? "bg-indigo-600 text-gray-50" : "bg-indigo-200 text-indigo-950"}`;

              switch (message.type) {
                case "text":
                  return (
                    <div key={message.id} className={wrapperClass}>
                      <div className={`min-w-[140px] max-w-[90%] ${chatClass}`}>
                        {room?.roomType === "group" && <div className={`${dataClass} rounded-br-xl`}>{message.sender_username}</div>}
                        <span className="block px-4 py-2">{message.content}</span>
                        {showTimestamp && <div className={`${dataClass} rounded-tl-xl ml-auto`}>{currentTime}</div>}
                      </div>
                    </div>
                  );

                case "image":
                  return (
                    <div key={message.id} className={wrapperClass}>
                      <div className={`min-w-[140px] max-w-[50%] ${chatClass}`}>
                        {room?.roomType === "group" && <div className={`${dataClass} rounded-br-xl`}>{message.sender_username}</div>}
                        <div className="block p-2">
                          <img src={message.content} alt={`image-${message.id}`} className={`block rounded-lg`} />
                        </div>
                        {showTimestamp && <div className={`${dataClass} rounded-tl-xl ml-auto`}>{currentTime}</div>}
                      </div>
                    </div>
                  );

                case "file":
                  return (
                    <div key={message.id} className={wrapperClass}>
                      <div className={`min-w-[140px] max-w-[50%] ${chatClass}`}>
                        {room?.roomType === "group" && <div className={`${dataClass} rounded-br-xl`}>{message.sender_username}</div>}
                        <div className={`flex flex-row gap-x-2 py-2 pl-2 pr-4`}>
                          <div className="aspect-[3/4] w-14 flex justify-center items-center shrink-0 bg-indigo-100 text-black text-[11px] leading-none rounded-lg select-none">{`.${getExtension(message.content)}`}</div>
                          <div className="w-full">
                            <span className="block font-bold break-all whitespace-normal">_100058428_mediaitem100058424.jpg</span>
                            <a href="#" className="flex flex-row items-center text-sm gap-x-1 hover:underline">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                        {showTimestamp && <div className={`${dataClass} rounded-tl-xl ml-auto`}>{currentTime}</div>}
                      </div>
                    </div>
                  );
              }
            }}
            isLoading={loadingRoom}
            Loader={() => (
              <div className="w-full h-full flex justify-center items-center">
                <SpinnerLoader width="w-[25px]" />
              </div>
            )}
            Empty={() => (
              <div className="w-full h-full flex flex-col justify-center items-center gap-y-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-32">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                <span className="font-bold">Start conversations</span>
              </div>
            )}
          />
          <div ref={messagesEndRef} className="pb-4" />
        </div>

        <form id="messageForm" onSubmit={handleSendText} className="relative flex flex-row items-center justify-between w-full p-4 bg-indigo-400 gap-x-4" autoComplete="off">
          <button type="button" ref={backToTopRef} className="appearance-none cursor-pointer absolute transition-all duration-300 ease-in-out scale-0 right-5 -top-9" onClick={() => scrollToBottom("smooth")}>
            <div className="relative">
              <div className="p-1 text-white bg-indigo-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                </svg>
              </div>
              <div ref={newMessageRef} className="absolute top-[-1px] left-[-1px] hidden">
                <div className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-rose-500"></span>
                </div>
              </div>
            </div>
          </button>

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
            ref={inputTextRef}
            placeholder="Type a message"
            className="w-full px-4 py-2.5 text-sm text-indigo-900 font-semibold placeholder-gray-400 bg-white rounded-md appearance-none placeholder:text-xs focus:outline-none focus:border-transparent transition-colors duration-300 ease-in-out"
          />

          <button type="submit" className="text-white appearance-none" disabled={loadingRoom}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
