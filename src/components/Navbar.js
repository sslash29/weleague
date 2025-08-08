"use client";

import Logo from "./Logo";

function Navbar() {
  let isLoggedIn = true;
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex justify-between items-center w-fit gap-3">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-1 cursor-pointer">
              <h4>Top Ranking</h4>
              <img src="/smallArrow.svg" alt="smallArrow" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <h4>Voting</h4>
              <img src="/smallArrow.svg" alt="smallArrow" />
            </div>
            <h4>Report A Problem</h4>
          </>
        ) : (
          <>
            <h4>About Us</h4>
            <h4>Report A Problem</h4>
            <h4>FAQ</h4>
            <h4>Contact Us</h4>
          </>
        )}
      </div>

      {isLoggedIn ? (
        <div className="rounded-full w-[55px] h-[55px] flex items-center justify-center bg-violet-light text-xl font-medium">
          A
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button className="p-3 py-2 border rounded-md hover:bg-violet-normal-hover hover:text-white transition-all cursor-pointer">
            Log In
          </button>
          <button className="p-3 py-2 border rounded-md hover:bg-violet-normal-hover hover:text-white transition-all cursor-pointer">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
