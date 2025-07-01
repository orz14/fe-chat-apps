import { create } from "zustand";

type RoomType = "personal";

type RoomsType = {
  room_type: RoomType;
  room_id: string;
  room_name: string;
  room_picture: string;
  user_id: number;
  is_online: boolean;
};

type PersonalRoomsState = {
  rooms: RoomsType[];
  setRooms: (rooms: RoomsType[]) => void;
};

export const usePersonalRoomsStore = create<PersonalRoomsState>((set) => ({
  rooms: [],
  setRooms: (rooms: RoomsType[]) =>
    set({
      rooms: rooms.map((room) => ({
        ...room,
        is_online: false,
      })),
    }),
}));
