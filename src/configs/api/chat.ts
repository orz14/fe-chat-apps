import useAxios from "@/hooks/useAxios";

function useChat() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/chats` : "https://be-chat.orzverse.com/api/chats";

  const loadChats = (roomId: string, lastSentAt: string | null, lastMessageId: string | null) => {
    if (!lastSentAt && !lastMessageId) {
      return axiosFetch("get", `${baseURL}/${roomId}`);
    } else {
      return axiosFetch("get", `${baseURL}/${roomId}/${lastSentAt}/${lastMessageId}`);
    }
  };

  const sendText = (id: string, room_id: string, type: string, content: string) => axiosFetch("post", `${baseURL}/send/text`, { id, room_id, type, content });

  return {
    loadChats,
    sendText,
  };
}

export default useChat;
