import { create } from "zustand";

type PageType = "login" | "main" | "logout" | "main-loader" | "not-found";

type PageState = {
  page: PageType;
  setPage: (page: PageType) => void;
};

export const usePageStore = create<PageState>((set) => ({
  page: "main-loader",
  setPage: (page: PageType) => set({ page: page }),
}));
