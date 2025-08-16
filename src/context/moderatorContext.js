"use client";
import { createContext, useContext, useState } from "react";

const moderatorContext = createContext();

export const ModeratorProvider = ({ children }) => {
  const [active, setActive] = useState("manage-players");

  return (
    <moderatorContext.Provider value={{ active, setActive }}>
      {children}
    </moderatorContext.Provider>
  );
};

export const useModerator = () => {
  const context = useContext(moderatorContext);
  if (context === undefined) {
    throw new Error("useModerator must be used within a ModeratorProvider");
  }
  return context;
};
