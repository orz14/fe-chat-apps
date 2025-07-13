import useAxios from "@/hooks/useAxios";

function useProfile() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/profile` : "https://be-chat.orzverse.com/api/profile";

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

  const updateProfileInformation = (type: string, value: any) => axiosFetch("patch", `${baseURL}/update`, { type, value });
  const updateProfileAvatar = (formData: any) =>
    axiosFetch("post", `${baseURL}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  return {
    currentUser,
    updateProfileInformation,
    updateProfileAvatar,
  };
}

export default useProfile;
