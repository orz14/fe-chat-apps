import echo from "@/lib/echo";
import { useRoomStore } from "@/stores/useRoomStore";
import { useEffect } from "react";
import { useToast } from "./use-toast";
import { usePersonalRoomsStore } from "@/stores/usePersonalRoomsStore";

export function usePresenceListener() {
  const { toast } = useToast();
  const { room, setRoom } = useRoomStore();
  const { setRooms } = usePersonalRoomsStore();
  let offlineTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const presenceListen = "presence-user";
    const presence = echo?.join(presenceListen);

    presence
      ?.here((users: any[]) => {
        if (!users) return;
        const onlineUserIds = users.map((user) => user.id);

        setRooms((rooms) => rooms.map((room) => (room.user_id !== null && onlineUserIds.includes(room.user_id) ? { ...room, is_online: true } : room)));
        setRoom((prev) => (prev.userId !== null && onlineUserIds.includes(prev.userId) ? { ...prev, isOnline: true } : prev));
      })
      .joining((user: any) => {
        if (!user) return;

        if (offlineTimeout) {
          clearTimeout(offlineTimeout);
          offlineTimeout = null;
        }

        setRooms((rooms) => rooms.map((room) => (room.user_id !== null && room.user_id === user.id ? { ...room, is_online: true } : room)));
        setRoom((prev) => (prev.userId !== null && prev.userId === user.id ? { ...prev, isOnline: true } : prev));
      })
      .leaving((user: any) => {
        if (!user) return;

        offlineTimeout = setTimeout(() => {
          setRooms((rooms) => rooms.map((room) => (room.user_id !== null && room.user_id === user.id ? { ...room, is_online: false } : room)));
          setRoom((prev) => (prev.userId !== null && prev.userId === user.id ? { ...prev, isOnline: false } : prev));

          offlineTimeout = null;
        }, 5000);
      })
      .error((_err: any) => {
        toast({
          variant: "destructive",
          description: "Terjadi kesalahan.",
        });
      });

    return () => {
      echo?.leave(presenceListen);
    };
  }, [room?.roomId]);
}
