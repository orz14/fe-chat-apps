import echo from "@/lib/echo";
import { useRoomStore } from "@/stores/useRoomStore";
import { useEffect } from "react";
import { useToast } from "./use-toast";

export function usePresenceListener() {
  const { toast } = useToast();
  const { room, setRoom } = useRoomStore();
  let offlineTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const presenceListen = "presence-user";
    const presence = echo?.join(presenceListen);

    presence
      ?.here((users: any[]) => {
        if (!users) return;
        const onlineUserIds = users.map((user) => user.id);

        setRoom((prev) => {
          if (prev.userId !== null && onlineUserIds.includes(prev.userId)) {
            return {
              ...prev,
              isOnline: true,
            };
          }
          return prev;
        });
      })
      .joining((user: any) => {
        if (!user) return;

        if (offlineTimeout) {
          clearTimeout(offlineTimeout);
          offlineTimeout = null;
        }

        setRoom((prev) => {
          if (prev.userId !== null && prev.userId === user.id) {
            return {
              ...prev,
              isOnline: true,
            };
          }
          return prev;
        });
      })
      .leaving((user: any) => {
        if (!user) return;

        offlineTimeout = setTimeout(() => {
          setRoom((prev) => {
            if (prev.userId !== null && prev.userId === user.id) {
              return {
                ...prev,
                isOnline: false,
              };
            }
            return prev;
          });

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
