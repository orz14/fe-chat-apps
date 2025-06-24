import Image from "next/image";

export default function MainLoader() {
  return (
    <section className="h-full flex flex-col justify-center items-center gap-y-7 overflow-hidden bg-indigo-100">
      <Image src="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/img/chat-apps-logo.webp" alt={process.env.NEXT_PUBLIC_APP_NAME || "Chat Apps"} width={408} height={174} className="w-full max-w-[400px] h-auto" priority={true} />

      <div className="progress-loader"></div>
    </section>
  );
}
