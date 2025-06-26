import { useRoomStore } from "@/stores/useRoomStore";

export default function ChatRoom() {
  const { room } = useRoomStore();

  return (
    <>
      <div className="flex flex-col">
        <div>target element: {room?.targetElement}</div>
        <div>room type: {room?.roomType}</div>
        <div>room id: {room?.roomId}</div>
        <div>room name: {room?.roomName}</div>
        <div>room picture: {room?.roomPicture ?? "null"}</div>
      </div>
    </>
  );
}
