import Image from "next/image";

export default function Chats() {
  return (
    <section className="flex flex-row h-full overflow-hidden bg-indigo-100">
      {/* Sidebar */}
      <div className="flex flex-col items-center justify-between h-full p-4 text-indigo-700 gap-y-4 shrink-0">
        <div>
          <button type="button" className="p-2 bg-indigo-200 rounded-full appearance-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div>
          <button type="button" className="p-2 rounded-full appearance-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chats */}
      <div className="h-full w-[360px] overflow-y-auto bg-indigo-200 p-4 text-sm space-y-2 shrink-0">
        <div className="flex flex-row items-center justify-between py-2 gap-x-4">
          <h1 className="text-xl font-bold pointer-events-none select-none">Chats</h1>

          <button type="button" className="p-1.5 rounded-full hover:bg-indigo-300 transition-colors duration-300 ease-in-out" title="New chat">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row items-center pb-1 text-xs gap-x-2">
          <a href="#" className="px-3 py-1 font-semibold text-indigo-700 transition-colors duration-300 ease-in-out bg-indigo-300 rounded-full hover:bg-indigo-300">
            Personal
          </a>
          <a href="#" className="px-3 py-1 font-semibold transition-colors duration-300 ease-in-out bg-indigo-100 rounded-full hover:bg-indigo-300">
            Group
          </a>
        </div>

        {/* mapping here */}
        <a href="#" className="flex flex-row items-center p-4 font-bold text-[13px] text-indigo-900 transition-all duration-300 ease-in-out bg-indigo-100 rounded-xl gap-x-2 hover:bg-indigo-300">
          {/* @isset($item['room_picture'])
                        {{--  --}}
                    @else
                        <img src="https://ui-avatars.com/api/?name={{ str_replace(' ', '+', $item['room_name']) }}"
                            alt="{{ $item['room_name'] }}" className="object-cover rounded-full size-8">
                    @endisset */}
          <span className="truncate">Room Name</span>
        </a>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center w-full h-full">
        <Image src="https://cdn.jsdelivr.net/gh/orz14/orzcode@main/img/chat-apps-logo.webp" alt={process.env.NEXT_PUBLIC_APP_NAME || "Chat Apps"} width={408} height={174} className="w-full max-w-[400px] h-auto" priority={true} />
      </div>
    </section>
  );
}
