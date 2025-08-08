"use client";
import { createContext, useContext, useState } from "react";

const RootAdminContext = createContext();

export const RootAdminProvider = ({ children }) => {
  const [active, setActive] = useState("manage-admins");

  return (
    <RootAdminContext.Provider value={{ active, setActive }}>
      {children}
    </RootAdminContext.Provider>
  );
};

export const useRootAdmin = () => {
  const context = useContext(RootAdminContext);
  if (context === undefined) {
    throw new Error("useRootAdmin must be used within a RootAdminProvider");
  }
  return context;
};
