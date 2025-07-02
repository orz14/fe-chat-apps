import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import useRoom from "@/configs/api/room";
import { useToast } from "@/hooks/use-toast";
import { useLoadingRoomStore } from "@/stores/useLoadingRoomStore";
import { usePersonalRoomsStore } from "@/stores/usePersonalRoomsStore";
import { useRoomStore } from "@/stores/useRoomStore";
import EachUtils from "@/utils/EachUtils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PersonalChats() {
  const { toast } = useToast();
  const { personal } = useRoom();
  const { rooms, setRooms } = usePersonalRoomsStore();
  const roomState = useRoomStore();
  const { loadingRoom } = useLoadingRoomStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await personal();
      if (res?.status === 200) {
        setRooms(res.data.rooms);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleRoomState(room: any) {
    if (roomState?.room?.roomId === room.room_id) return;
    roomState.setRoom({
      targetElement: "chat-room",
      roomType: room.room_type,
      roomId: room.room_id,
      roomName: room.room_name,
      roomPicture: room.room_picture,
      userId: room.user_id,
      isOnline: false,
    });
  }

  return (
    <EachUtils
      of={rooms}
      render={(room: any) => (
        <button
          key={room.room_id}
          type="button"
          className={`appearance-none w-full flex flex-row items-center justify-between p-4 font-bold text-[13px] text-indigo-900 transition-colors duration-300 ease-in-out rounded-xl gap-x-2 hover:bg-indigo-300 overflow-hidden group ${
            roomState?.room?.roomId === room.room_id ? "bg-indigo-300" : "bg-indigo-100"
          }`}
          onClick={() => handleRoomState(room)}
          disabled={loadingRoom}
        >
          <div className="w-full max-w-[260px] flex flex-row items-center gap-x-2">
            <div className="relative">
              {room.room_picture?.length > 0 ? (
                <Image src={room.room_picture} alt={room.room_name} width={50} height={50} className="object-cover rounded-full size-8 pointer-events-none" />
              ) : (
                <Image src={`https://ui-avatars.com/api/?name=${room.room_name.replaceAll(" ", "+")}`} alt={room.room_name} width={50} height={50} className="object-cover rounded-full size-8 pointer-events-none" />
              )}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full group-hover:border-indigo-300 transition-colors duration-300 ease-in-out ${room.is_online ? "bg-emerald-400" : "bg-rose-500"} ${
                  roomState?.room?.roomId === room.room_id ? "border-indigo-300" : "border-indigo-100"
                }`}
              ></div>
            </div>
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
          <span>No conversations</span>
        </div>
      )}
    />
  );
}
