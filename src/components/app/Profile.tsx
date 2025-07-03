export default function Profile() {
  return (
    <>
      <div className="py-2">
        <h1 className="text-xl font-bold pointer-events-none select-none">Profile</h1>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="size-40 bg-indigo-100 rounded-full">{/* profil picture here... */}</div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Name</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          <span className="truncate">John Doe</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Username</label>
        <div className="w-full flex flex-row justify-between items-center gap-x-4">
          <span className="truncate">user-ey297y92</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 -mt-1 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Email</label>
        <div className="w-full">
          <span className="truncate">johndoe@mail.com</span>
        </div>
      </div>

      <div className="py-4">
        <div className="w-full h-[1px] bg-indigo-100"></div>
      </div>

      <div>
        <button type="button" className="appearance-none w-full py-3 px-5 font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 ease-in-out cursor-pointer">
          Log out
        </button>
      </div>
    </>
  );
}
