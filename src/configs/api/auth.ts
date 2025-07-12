import useAxios from "@/hooks/useAxios";

function useAuth() {
  const { axiosLogout } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : "https://be-chat.orzverse.com/api/auth";

  const logout = (token?: string) => axiosLogout(`${baseURL}/logout`, token);

  return {
    logout,
  };
}

export default useAuth;
