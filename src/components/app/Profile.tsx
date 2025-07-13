import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { encryptData } from "@/lib/crypto";
import { useUserDataStore } from "@/stores/useUserDataStore";
import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import useProfile from "@/configs/api/profile";

export default function Profile() {
  const { toast } = useToast();
  const { user, setUser } = useUserDataStore();
  const { logoutAuth } = useLogout();
  const { logout } = useAuth();
  const { updateProfileInformation, updateProfileAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

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
    const valueMap: Record<string, string | undefined> = {
      name: user.name!,
      username: user.username!,
    };
    setValue(valueMap[target] ?? "");

    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    });
  }

  function handleEditProfileAvatar() {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    inputFileRef.current?.click();
  }

  async function handleUpdateProfileInformation() {
    const valueBefore = isEditing === "name" ? user.name! : isEditing === "username" ? user.username! : "";

    if (valueBefore === value) {
      setIsEditing(null);
      setValue("");
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfileInformation(isEditing!, value);
      if (res?.status === 200) {
        const updatedUser = {
          ...user,
          name: res.data.user.name,
          username: res.data.user.username,
          avatar: res.data.user.avatar,
        };

        setUser(updatedUser);

        const encryptedData = encryptData({
          token: updatedUser.token,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsEditing("avatar");
    const files = e.target.files;
    if (!files || files.length === 0) {
      e.target.value = "";
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("_method", "patch");
    formData.append("type", "avatar");
    formData.append("value", file);

    setLoading(true);
    try {
      const res = await updateProfileAvatar(formData);
      if (res?.status === 200) {
        const updatedUser = {
          ...user,
          name: res.data.user.name,
          username: res.data.user.username,
          avatar: res.data.user.avatar,
        };

        setUser(updatedUser);

        const encryptedData = encryptData({
          token: updatedUser.token,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
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
            <Image src={user.avatar} alt={user.name!} width={200} height={200} className="size-full object-cover bg-indigo-100 rounded-full pointer-events-none" unoptimized />
          ) : user.name && user.name?.length > 0 ? (
            <Image
              src={`https://ui-avatars.com/api/?background=e0e7ff&color=000&size=200&name=${user.name.replaceAll(" ", "+")}&format=svg`}
              alt={user.name!}
              width={200}
              height={200}
              className="size-full object-cover bg-indigo-100 rounded-full pointer-events-none"
            />
          ) : (
            <div className="size-full flex justify-center items-center bg-indigo-100 text-indigo-900 rounded-full pointer-events-none">
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
            <>
              <input type="file" hidden ref={inputFileRef} accept="image/*" onChange={handleAvatarChange} />

              {isEditing === "avatar" && loading && (
                <div className="absolute top-0 left-0 size-full flex justify-center items-center text-white bg-black rounded-full opacity-50 z-10">
                  <Loader2 className="animate-spin size-6" />
                </div>
              )}

              <button
                type="button"
                onClick={handleEditProfileAvatar}
                className="appearance-none absolute bottom-1 right-1 size-10 bg-white hover:bg-gray-200 border-4 border-indigo-200 rounded-full cursor-pointer z-20 transition-colors duration-300 ease-in-out"
              >
                <div className="size-full flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </button>
            </>
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
