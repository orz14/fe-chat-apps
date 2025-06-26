import { create } from "zustand";

type SidebarType = "chats" | "profile";

type SidebarState = {
  sidebar: SidebarType;
  setSidebar: (sidebar: SidebarType) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  sidebar: "chats",
  setSidebar: (sidebar: SidebarType) => set({ sidebar: sidebar }),
}));
