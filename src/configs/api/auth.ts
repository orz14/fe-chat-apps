import useAxios from "@/hooks/useAxios";

function useAuth() {
  const { axiosFetch, axiosLogout } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : "https://be-chat.orzverse.com/api/auth";

  const currentUser = (token: string) =>
    axiosFetch(
      "get",
      `${baseURL}/current-user`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  const logout = (token?: string) => axiosLogout(`${baseURL}/logout`, token);

  return {
    currentUser,
    logout,
  };
}

export default useAuth;
