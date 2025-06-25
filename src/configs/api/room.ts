import useAxios from "@/hooks/useAxios";

function useRoom() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/rooms` : "https://be-chat.orzverse.com/api/rooms";

  const personal = () => axiosFetch("get", `${baseURL}/personal`);
  const group = () => axiosFetch("get", `${baseURL}/group`);

  return {
    personal,
    group,
  };
}

export default useRoom;
