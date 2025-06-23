export default function GroupChats() {
  return (
    <>
      <button type="button" className="appearance-none w-full flex flex-row items-center p-4 font-bold text-[13px] text-indigo-900 transition-all duration-300 ease-in-out bg-indigo-100 rounded-xl gap-x-2 hover:bg-indigo-300">
        {/* @isset($item['room_picture'])
            {{--  --}}
        @else
            <img src="https://ui-avatars.com/api/?name={{ str_replace(' ', '+', $item['room_name']) }}"
                alt="{{ $item['room_name'] }}" className="object-cover rounded-full size-8">
        @endisset */}
        <span className="truncate">Group Name</span>
      </button>
    </>
  );
}
