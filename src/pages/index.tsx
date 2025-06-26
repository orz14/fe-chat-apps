import { comfortaa } from "@/lib/fonts";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MainLoader from "@/components/loaders/MainLoader";
import NotFound from "@/components/NotFound";
import useAuth from "@/configs/api/auth";
import { decryptData } from "@/lib/crypto";

const Login = dynamic(() => import("@/components/auth/Login"), { loading: () => <MainLoader /> });
const Main = dynamic(() => import("@/components/app/Main"), { loading: () => <MainLoader /> });

export default function IndexPage() {
  const [page, setPage] = useState<string>("main-loader");
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentUser } = useAuth();

  const renderPage = () => {
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
  };

  useEffect(() => {
    const credentials = localStorage.getItem("credentials");
    if (credentials) {
      handleCheckCredentials(credentials);
    } else {
      // redirect to login page
      navigate("login");
    }
  }, []);

  async function handleCheckCredentials(credentials: string) {
    // verify credentials then redirect to chat page when verified
    const decryptedData = decryptData(credentials);
    try {
      const resUser = await currentUser(decryptedData?.token);
      if (resUser?.status === 200) {
        navigate("main");
      }
    } catch (err) {
      console.log(err);
      // delete credentials then redirect to login page when not valid
      localStorage.removeItem("credentials");
      navigate("login");
    }
  }

  const navigate = (target: string) => {
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
  };

  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  return (
    <main className={`${comfortaa.className} w-full h-svh flex items-center justify-center lg:p-5`}>
      <div className="w-full h-full overflow-hidden lg:rounded-2xl">{renderPage()}</div>
    </main>
  );
}
