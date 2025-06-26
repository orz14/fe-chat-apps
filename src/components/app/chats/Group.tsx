import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import useRoom from "@/configs/api/room";
import EachUtils from "@/utils/EachUtils";
import Image from "next/image";
import { useEffect, useState } from "react";

type RoomsType = {
  room_type: string;
  room_id: string;
  room_name: string;
  room_picture: string;
};

export default function GroupChats({ chatRoom, setChatRoom }: { chatRoom: any; setChatRoom: (room: any) => void }) {
  const { group } = useRoom();
  const [rooms, setRooms] = useState<RoomsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await group();
      if (res?.status === 200) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <EachUtils
      of={rooms}
      render={(room: any) => (
        <button
          key={room.room_id}
          type="button"
          className={`appearance-none w-full flex flex-row items-center justify-between p-4 font-bold text-[13px] text-indigo-900 transition-all duration-300 ease-in-out rounded-xl gap-x-2 hover:bg-indigo-300 overflow-hidden ${
            chatRoom?.roomId === room.room_id ? "bg-indigo-300" : "bg-indigo-100"
          }`}
          onClick={() =>
            setChatRoom({
              targetElement: "chat-room",
              roomType: room.room_type,
              roomId: room.room_id,
              roomName: room.room_name,
              roomPicture: room.room_picture,
            })
          }
        >
          <div className="w-full max-w-[260px] flex flex-row items-center gap-x-2">
            {room.room_picture?.length > 0 ? (
              <Image src={room.room_picture} alt={room.room_name} width={50} height={50} className="object-cover rounded-full size-8" />
            ) : (
              <div className="size-8 flex justify-center items-center bg-[#ddd] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path
                    fillRule="evenodd"
                    d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                    clipRule="evenodd"
                  />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
              </div>
            )}
            <span className="max-w-[200px] truncate">{room.room_name}</span>
          </div>
          {/* <div className="flex min-h-4 min-w-4 max-w-[51px] items-center justify-center rounded-full bg-rose-500 text-white px-2 py-1 text-[11px] leading-none truncate">
            <span>666</span>
          </div> */}
        </button>
      )}
      isLoading={loading}
      Loader={() => (
        <div className="w-full flex justify-center items-center p-4">
          <SpinnerLoader width="w-[25px]" />
        </div>
      )}
      Empty={() => (
        <div className="w-full text-center p-4">
          <span>No conversation</span>
        </div>
      )}
    />
  );
}
