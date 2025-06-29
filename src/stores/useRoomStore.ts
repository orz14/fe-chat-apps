import { create } from "zustand";

type ElementType = "chat-box" | "chat-room";

type RoomType = {
  targetElement: ElementType;
  roomType: string | null;
  roomId: string | null;
  roomName: string | null;
  roomPicture: string | null;
};

type RoomState = {
  room: RoomType;
  setRoom: (room: RoomType) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: {
    targetElement: "chat-box",
    roomType: null,
    roomId: null,
    roomName: null,
    roomPicture: null,
  },
  setRoom: (room: RoomType) => set({ room: room }),
}));
