import { useUserDataStore } from "@/stores/useUserDataStore";
import { useEffect } from "react";
import MetaTag from "./MetaTag";
import SpinnerLoader from "./loaders/SpinnerLoader";
import { usePageStore } from "@/stores/usePageStore";

export default function Logout() {
  const { setUser } = useUserDataStore();
  const { setPage } = usePageStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUser({
        id: null,
        name: null,
        username: null,
        email: null,
        avatar: null,
        token: null,
      });

      localStorage.removeItem("credentials");

      setPage("login");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <MetaTag />

      <section className="h-full flex flex-row justify-center items-center gap-x-2 bg-indigo-100">
        <SpinnerLoader width="w-5 -mt-1" />
        <span className="font-bold">Logging Out</span>
      </section>
    </>
  );
}
