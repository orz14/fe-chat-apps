import { useUserDataStore } from "@/stores/useUserDataStore";
import { useToast } from "./use-toast";
import { useEffect } from "react";
import echo from "@/lib/echo";
import { showNotification } from "@/utils/notifications";

export function useNotificationListener() {
  const { toast } = useToast();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (!!user?.id && "Notification" in window && Notification.permission === "granted") {
      const userListen = `user.${user.id}`;
      const channel = echo?.private(userListen);

      if (!channel) return;

      channel
        ?.listen(".message.received", (e: any) => {
          if (!e?.content) return;
          if (e.content.sender_id === user.id) return;

          let content: object = {};
          if (e.content.room_type === "personal") {
            if (e.content.type === "text") {
              content = {
                body: e.content.content,
              };
            } else if (e.content.type === "image") {
              content = {
                image: e.content.content,
              } as any;
            } else if (e.content.type === "file") {
              content = {
                body: "Mengirim sebuah file.",
              };
            }
            showNotification(`Pesan dari ${e.content.sender_name}`, content);
          } else if (e.content.room_type === "group") {
            if (e.content.type === "text") {
              content = {
                body: `${e.content.sender_username}: ${e.content.content}`,
              };
            } else if (e.content.type === "image") {
              content = {
                body: `${e.content.sender_username} mengirim sebuah gambar.`,
                image: e.content.content,
              } as any;
            } else if (e.content.type === "file") {
              content = {
                body: `${e.content.sender_username} mengirim sebuah file.`,
              };
            }
            showNotification(e.content.room_name, content);
          }
        })
        .error((_err: any) => {
          toast({
            variant: "destructive",
            description: "Terjadi kesalahan.",
          });
        });

      return () => {
        channel?.stopListening(".message.received");
        echo?.leave(userListen);
      };
    }
  }, [user.id]);
}
