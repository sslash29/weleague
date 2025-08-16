"use client";
import { createContext, useContext, useState } from "react";

const globalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [notification, setNotification] = useState("");

  return (
    <globalContext.Provider value={{ notification, setNotification }}>
      {children}
    </globalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(globalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
