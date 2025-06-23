import useRoom from "@/configs/api/room";
import { useEffect, useState } from "react";

export default function PersonalChats() {
  const { personal } = useRoom();
  const [rooms, setRooms] = useState<Array<any>>([]);

  async function handleFetch() {
    try {
      const res = await personal();
      if (res?.status === 200) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      {rooms?.map((room: any, index: number) => (
        <button
          key={`personal-${index}`}
          type="button"
          className="appearance-none w-full flex flex-row items-center justify-between p-4 font-bold text-[13px] text-indigo-900 transition-all duration-300 ease-in-out bg-indigo-100 rounded-xl gap-x-2 hover:bg-indigo-300 overflow-hidden"
        >
          <div className="w-full max-w-[260px] flex flex-row items-center gap-x-2">
            {room?.room_picture?.length > 0 ? (
              <img src={room.room_picture} alt={room.room_name} className="object-cover rounded-full size-8" />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${room.room_name.replaceAll(" ", "+")}`} alt={room.room_name} className="object-cover rounded-full size-8" />
            )}
            <span className="truncate">{room.room_name}</span>
          </div>
          {/* <div>
            <span className="py-0.5 px-1 text-xs text-white bg-rose-500 rounded-full">0</span>
          </div> */}
        </button>
      ))}
    </>
  );
}
