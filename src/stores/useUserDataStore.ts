import { create } from "zustand";

type UserType = {
  id: number | null;
  name: string | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
  token: string | null;
};

type UserDataState = {
  user: UserType;
  setUser: (user: UserType) => void;
};

export const useUserDataStore = create<UserDataState>((set) => ({
  user: {
    id: null,
    name: null,
    username: null,
    email: null,
    avatar: null,
    token: null,
  },
  setUser: (user: UserType) => set({ user: user }),
}));
