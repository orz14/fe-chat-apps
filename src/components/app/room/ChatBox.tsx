import Image from "next/image";

export default function ChatBox() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image src="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/img/chat-apps-logo.webp" alt={process.env.NEXT_PUBLIC_APP_NAME || "Chat Apps"} width={408} height={174} className="w-full max-w-[400px] h-auto" priority={true} />
    </div>
  );
}
