import { create } from "zustand";

type RoomType = "group";

type RoomsType = {
  room_type: RoomType;
  room_id: string;
  room_name: string;
  room_picture: string;
};

type GroupRoomsState = {
  rooms: RoomsType[];
  setRooms: (rooms: RoomsType[]) => void;
};

export const useGroupRoomsStore = create<GroupRoomsState>((set) => ({
  rooms: [],
  setRooms: (rooms: RoomsType[]) => set({ rooms: rooms }),
}));
