import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useUserDataStore } from "@/stores/useUserDataStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const { user } = useUserDataStore();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  function logoutAuth(notification: boolean = false) {
    if (notification) {
      router.push("/auth/logout?notification=true");
    } else {
      router.push("/auth/logout");
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await logout();
      if (res?.status === 200) {
        logoutAuth();
      }
    } catch (err: any) {
      if (err?.status === 401) {
        logoutAuth(true);
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
        // await writeLogClient("error", err);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <div className="py-2">
        <h1 className="text-xl font-bold pointer-events-none select-none">Profile</h1>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="size-40 bg-indigo-100 rounded-full overflow-hidden">
          {user.avatar && user.avatar?.length > 0 ? (
            <Image src={user.avatar} alt={user.name!} width={160} height={160} className="size-full object-cover pointer-events-none" />
          ) : user.name && user.name?.length > 0 ? (
            <Image src={`https://ui-avatars.com/api/?size=160&name=${user.name!.replaceAll(" ", "+")}`} alt={user.name!} width={160} height={160} className="size-full object-cover pointer-events-none" />
          ) : (
            <div className="size-full flex justify-center items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Name</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          <span className="truncate">{user.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Username</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          <span className="truncate">{user.username}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Email</label>
        <div className="w-full">
          <span className="truncate">{user.email}</span>
        </div>
      </div>

      <div className="py-4">
        <div className="w-full h-[1px] bg-indigo-100"></div>
      </div>

      <div>
        <button
          type="button"
          className={`appearance-none w-full flex flex-row justify-center items-center gap-x-1 py-3 px-5 font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 ease-in-out cursor-pointer ${
            loading ? "opacity-80 pointer-events-none" : ""
          }`}
          onClick={handleLogout}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </>
  );
}
