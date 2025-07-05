import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { encryptData } from "@/lib/crypto";
import { useUserDataStore } from "@/stores/useUserDataStore";
import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { user, setUser } = useUserDataStore();
  const { logoutAuth } = useLogout();
  const { update, logout } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleLogout() {
    setIsEditing(null);
    setValue("");
    setLoading(true);
    try {
      const res = await logout();
      if (res?.status === 200) {
        logoutAuth();
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
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

  function handleEditProfileInformation(target: string) {
    // alert("Coming Soon ...");

    setIsEditing(target);
    if (target === "name") {
      setValue(user.name!);
    } else if (target === "username") {
      setValue(user.username!);
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    });
  }

  async function handleUpdateProfileInformation() {
    setLoading(true);
    try {
      const res = await update(isEditing!, value);
      if (res?.status === 200) {
        // update user data state
        if (isEditing === "name") {
          setUser({ ...user, name: value });
        } else if (isEditing === "username") {
          setUser({ ...user, username: value.toLowerCase().replace(/\s+/g, "-") });
        }

        const encryptedData = encryptData({
          token: user.token,
          user: {
            id: user.id,
            name: isEditing === "name" ? value : user.name,
            username: isEditing === "username" ? value.toLowerCase().replace(/\s+/g, "-") : user.username,
            email: user.email,
            avatar: user.avatar,
          },
        });

        if (encryptedData) {
          localStorage.setItem("credentials", encryptedData);
        }
      }
    } catch (err: any) {
      if (err?.status !== 401) {
        toast({
          variant: "destructive",
          description: err.message,
        });
        // await writeLogClient("error", err);
      }
    } finally {
      setIsEditing(null);
      setValue("");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="py-2">
        <h1 className="text-xl font-bold pointer-events-none select-none">Profile</h1>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="relative size-40 bg-indigo-100 rounded-full">
          {user.avatar && user.avatar?.length > 0 ? (
            <Image src={user.avatar} alt={user.name!} width={160} height={160} className="size-full object-cover rounded-full pointer-events-none" />
          ) : user.name && user.name?.length > 0 ? (
            <Image src={`https://ui-avatars.com/api/?size=160&name=${user.name!.replaceAll(" ", "+")}`} alt={user.name!} width={160} height={160} className="size-full object-cover rounded-full pointer-events-none" />
          ) : (
            <div className="size-full flex justify-center items-center rounded-full pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {user.name && user.name?.length > 0 && (
            <button
              type="button"
              onClick={() => alert("Coming Soon ...")}
              className="appearance-none absolute bottom-1 right-1 size-10 bg-white hover:bg-gray-200 border-4 border-indigo-200 rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
            >
              <div className="size-full flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Name</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          {isEditing === "name" ? (
            <input type="text" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-transparent border-b border-gray-400 focus:border-indigo-400 focus:outline-none" />
          ) : (
            <span className="truncate">{user.name}</span>
          )}
          <button type="button" onClick={isEditing === "name" ? handleUpdateProfileInformation : () => handleEditProfileInformation("name")} className="appearance-none cursor-pointer">
            {isEditing === "name" ? (
              loading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Username</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          {isEditing === "username" ? (
            <input type="text" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-transparent border-b border-gray-400 focus:border-indigo-400 focus:outline-none" />
          ) : (
            <span className="truncate">{user.username}</span>
          )}
          <button type="button" onClick={isEditing === "username" ? handleUpdateProfileInformation : () => handleEditProfileInformation("username")} className="appearance-none cursor-pointer">
            {isEditing === "username" ? (
              loading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Email</label>
        <div className="w-full">
          <span className="truncate">{user.email}</span>
        </div>
      </div>

      <div className="py-4">
        <div className="w-full h-[1px] bg-gray-400"></div>
      </div>

      <div>
        <button
          type="button"
          className={`appearance-none w-full flex flex-row justify-center items-center gap-x-1 py-3 px-5 font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 ease-in-out cursor-pointer ${
            loading || isEditing !== null ? "opacity-80 pointer-events-none" : ""
          }`}
          onClick={handleLogout}
          disabled={loading || isEditing !== null}
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
