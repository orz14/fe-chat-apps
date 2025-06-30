import { create } from "zustand";

type LoadingRoomState = {
  loadingRoom: boolean;
  setLoadingRoom: (loadingRoom: boolean) => void;
};

export const useLoadingRoomStore = create<LoadingRoomState>((set) => ({
  loadingRoom: false,
  setLoadingRoom: (loadingRoom: boolean) => set({ loadingRoom: loadingRoom }),
}));
