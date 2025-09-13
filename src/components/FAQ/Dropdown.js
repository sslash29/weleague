"use client";
import { capitalizeFirst } from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";

function Accordion({ header, bodyText }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[800px]">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left"
      >
        <h2 className="text-6xl font-bold w-[700px]">
          {capitalizeFirst(header)}
        </h2>
        <Image
          width={36}
          height={22}
          src="/Chevron.svg"
          alt="chevron"
          className={`w-[36px] h-[22px] transition-transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Always show bottom border */}
      <div className="border-b-[2.5px] " />

      {/* Body below border */}
      {isOpen && (
        <div className="px-4 py-3 text-gray-700 font-medium">{bodyText}</div>
      )}
    </div>
  );
}

export default Accordion;
