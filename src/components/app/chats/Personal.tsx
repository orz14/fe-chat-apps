import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import useRoom from "@/configs/api/room";
import EachUtils from "@/utils/EachUtils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PersonalChats() {
  const { personal } = useRoom();
  const [rooms, setRooms] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await personal();
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
          className="appearance-none w-full flex flex-row items-center justify-between p-4 font-bold text-[13px] text-indigo-900 transition-all duration-300 ease-in-out bg-indigo-100 rounded-xl gap-x-2 hover:bg-indigo-300 overflow-hidden"
        >
          <div className="w-full max-w-[260px] flex flex-row items-center gap-x-2">
            {room?.room_picture?.length > 0 ? (
              <Image src={room.room_picture} alt={room.room_name} width={50} height={50} className="object-cover rounded-full size-8" />
            ) : (
              <Image src={`https://ui-avatars.com/api/?name=${room.room_name.replaceAll(" ", "+")}`} alt={room.room_name} width={50} height={50} className="object-cover rounded-full size-8" />
            )}
            <span className="truncate">{room.room_name}</span>
          </div>
          {/* <div>
            <span className="p-1 text-xs text-white bg-rose-500 rounded-full">0</span>
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
