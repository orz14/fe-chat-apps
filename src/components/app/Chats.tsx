import { useEffect } from "react";
import dynamic from "next/dynamic";
import SpinnerLoader from "../loaders/SpinnerLoader";
import { useChatsStore } from "@/stores/useChatsStore";

const PersonalChats = dynamic(() => import("@/components/app/chats/Personal"), {
  loading: () => (
    <div className="w-full flex justify-center items-center p-4">
      <SpinnerLoader width="w-[25px]" />
    </div>
  ),
});

const GroupChats = dynamic(() => import("@/components/app/chats/Group"), {
  loading: () => (
    <div className="w-full flex justify-center items-center p-4">
      <SpinnerLoader width="w-[25px]" />
    </div>
  ),
});

export default function Chats() {
  const { chats, setChats } = useChatsStore();

  useEffect(() => {
    navigate("personal");
  }, []);

  function navigate(target: string) {
    if (target === chats.target) return;

    setChats({
      target: "loader",
      component: (
        <div className="w-full flex justify-center items-center p-4">
          <SpinnerLoader width="w-[25px]" />
        </div>
      ),
    });

    switch (target) {
      case "personal":
        setChats({
          target: "personal",
          component: null,
        });
        break;
      case "group":
        setChats({
          target: "group",
          component: null,
        });
        break;
    }
  }

  function renderChats() {
    switch (chats.target) {
      case "personal":
        return <PersonalChats />;
      case "group":
        return <GroupChats />;
    }
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between py-2 gap-x-4">
        <h1 className="text-xl font-bold pointer-events-none select-none">Chats</h1>

        <button type="button" className="p-1.5 rounded-full hover:bg-indigo-300 transition-colors duration-300 ease-in-out" title="New chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-row items-center pb-1 text-xs gap-x-2">
        <button
          type="button"
          className={`appearance-none px-3 py-1 font-semibold transition-colors duration-300 ease-in-out rounded-full hover:bg-indigo-300 ${chats.target === "personal" ? "text-indigo-700 bg-indigo-300" : "text-black bg-indigo-100"}`}
          onClick={() => navigate("personal")}
        >
          Personal
        </button>
        <button
          type="button"
          className={`appearance-none px-3 py-1 font-semibold transition-colors duration-300 ease-in-out rounded-full hover:bg-indigo-300 ${chats.target === "group" ? "text-indigo-700 bg-indigo-300" : "text-black bg-indigo-100"}`}
          onClick={() => navigate("group")}
        >
          Group
        </button>
      </div>

      {renderChats()}
    </>
  );
}
