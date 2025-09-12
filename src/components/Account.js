"use client";

import { truncateName } from "@/utils/helpers";
import { LogOut } from "./LogOut";
import DeleteAccount from "./DeleteAccount";

function Account({ userData, userId }) {
  console.log(userData);
  return (
    <div className="flex flex-col gap-5 justify-center">
      <div className="flex gap-5 items-center">
        <div className="w-[70px] h-[70px] flex items-center justify-center bg-violet-light rounded-full text-4xl text-black">
          A
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold">{userData.full_name}</h2>
          <h2 className="text-2xl">Class:{userData.class}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-[300px]">
        <div>
          <h3 className="font-bold text-3xl">Phone Number</h3>
          <input
            disabled
            value={userData.phone_number}
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-full"
          />
        </div>
        <div>
          <h3 className="font-bold text-3xl">Email</h3>
          <input
            disabled
            value={truncateName(userData.email, 19)}
            className="p-2 rounded-lg bg-[#f2f2f2] outline-0 w-full"
          />
        </div>
        <div className="w-full flex gap-3 items-center">
          <LogOut />
          <DeleteAccount userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Account;
