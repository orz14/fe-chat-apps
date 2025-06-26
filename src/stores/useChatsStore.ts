import { JSX } from "react";
import { create } from "zustand";

type TargetType = "personal" | "group" | "loader";

type ChatsType = {
  target: TargetType;
  component: JSX.Element | null;
};

type ChatsState = {
  chats: ChatsType;
  setChats: (chats: ChatsType) => void;
};

export const useChatsStore = create<ChatsState>((set) => ({
  chats: {
    target: "personal",
    component: null,
  },
  setChats: (chats: ChatsType) => set({ chats: chats }),
}));
