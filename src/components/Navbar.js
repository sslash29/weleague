"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { AnimatePresence, motion } from "motion/react";

function Navbar({ user }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (user) setIsLoggedIn(true);
  }, [user]);

  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex justify-between items-center w-fit gap-3">
        {isLoggedIn ? (
          <>
            {/* Top Ranking Dropdown */}
            <div
              className="flex items-center gap-1 cursor-pointer relative"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              <h4>Top Ranking</h4>
              <motion.img
                src="/smallArrow.svg"
                alt="smallArrow"
                animate={{ rotate: openDropdown ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-4 h-4"
              />
              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5 absolute top-7 left-0 bg-black text-white shadow-md px-4 z-10 rounded-lg text-xl w-[200px] py-5"
                  >
                    <Link
                      href="/rankings/goal-ranking"
                      className="w-fit hover:bg-[#d9d9d9]/50 p-2 rounded-md"
                    >
                      Goal Ranking
                    </Link>
                    <Link
                      href="/rankings/assist-ranking"
                      className="w-fit hover:bg-[#d9d9d9]/50 p-2 rounded-md"
                    >
                      Assist Ranking
                    </Link>
                    <Link
                      href="/rankings/point-ranking"
                      className="w-fit hover:bg-[#d9d9d9]/50 p-2 rounded-md"
                    >
                      Point Ranking
                    </Link>
                    <Link
                      href="/rankings/save-ranking"
                      className="w-fit hover:bg-[#d9d9d9]/50 p-2 rounded-md"
                    >
                      Save Ranking
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Nav Items */}
            <div className="flex items-center gap-1 cursor-pointer">
              <h4>Voting</h4>
              <img src="/smallArrow.svg" alt="smallArrow" className="w-4 h-4" />
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
          <Link href="/auth/log-in">
            <button className="p-3 py-2 border rounded-md hover:bg-violet-normal-hover hover:text-white transition-all cursor-pointer">
              Log In
            </button>
          </Link>
          <Link href="/auth/sign-up">
            <button className="p-3 py-2 border rounded-md hover:bg-violet-normal-hover hover:text-white transition-all cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
