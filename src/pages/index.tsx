import { comfortaa } from "@/lib/fonts";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import MainLoader from "@/components/loaders/MainLoader";
import NotFound from "@/components/NotFound";
import useAuth from "@/configs/api/auth";
import { decryptData } from "@/lib/crypto";
import { usePageStore } from "@/stores/usePageStore";
import { Toaster } from "@/components/ui/toaster";

const Login = dynamic(() => import("@/components/auth/Login"), { loading: () => <MainLoader /> });
const Main = dynamic(() => import("@/components/app/Main"), { loading: () => <MainLoader /> });

export default function IndexPage() {
  const { page, setPage } = usePageStore();
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    handleCheckCredentials();
  }, []);

  async function handleCheckCredentials() {
    const credentials = localStorage.getItem("credentials") ?? null;
    if (credentials) {
      const decryptedData = decryptData(credentials);
      if (decryptedData) {
        try {
          const resUser = await currentUser(decryptedData?.token);
          if (resUser?.status === 200) {
            navigate("main");
          }
        } catch (_err: any) {
          localStorage.removeItem("credentials");
          navigate("login");
        }
      } else {
        localStorage.removeItem("credentials");
        navigate("login");
      }
    } else {
      navigate("login");
    }
  }

  function navigate(target: string) {
    if (target === page) return;

    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    setPage("main-loader");

    timeOutRef.current = setTimeout(() => {
      switch (target) {
        case "login":
          setPage("login");
          break;
        case "main":
          setPage("main");
          break;
        default:
          setPage("not-found");
          break;
      }
      timeOutRef.current = null;
    }, 1000);
  }

  function renderPage() {
    switch (page) {
      case "login":
        return <Login />;
      case "main":
        return <Main />;
      case "main-loader":
        return <MainLoader />;
      case "not-found":
        return <NotFound />;
    }
  }

  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  return (
    <>
      <main className={`${comfortaa.className} w-full h-svh flex items-center justify-center lg:p-5`}>
        <div className="w-full h-full overflow-hidden lg:rounded-2xl">{renderPage()}</div>
      </main>
      <Toaster />
    </>
  );
}
