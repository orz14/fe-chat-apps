import { create } from "zustand";

type ElementType = "chat-box" | "chat-room";

type RoomType = {
  targetElement: ElementType;
  roomType: string | null;
  roomId: string | null;
  roomName: string | null;
  roomPicture: string | null;
  userId: number | null;
  isOnline: boolean | null;
};

type RoomState = {
  room: RoomType;
  reselected: boolean;
  setRoom: (room: RoomType | ((prevRooms: RoomType) => RoomType)) => void;
  markReselected: () => void;
  resetReselected: () => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: {
    targetElement: "chat-box",
    roomType: null,
    roomId: null,
    roomName: null,
    roomPicture: null,
    userId: null,
    isOnline: null,
  },
  reselected: false,
  // setRoom: (room: RoomType) => set({ room: room }),
  setRoom: (updater) =>
    set((state) => ({
      room: typeof updater === "function" ? updater(state.room) : updater,
    })),
  markReselected: () => set({ reselected: true }),
  resetReselected: () => set({ reselected: false }),
}));
