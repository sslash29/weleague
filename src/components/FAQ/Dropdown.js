"use client";
import { capitalizeFirst } from "@/utils/helpers";
import { useState } from "react";

function Accordion({ header, bodyText }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full ">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left"
      >
        <h2 className=" text-6xl font-bold w-[430px]">
          {capitalizeFirst(header)}
        </h2>
        {isOpen ? (
          <img src="/Chevron" className=" rotate-180" alt="chevron" />
        ) : (
          <img src="/Chevron" alt="chevron" />
        )}
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-4 py-3 text-gray-700 border-t">{bodyText}</div>
      )}
    </div>
  );
}

export default Accordion;
