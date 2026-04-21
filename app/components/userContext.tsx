"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getUser } from "@/lib/getUser";

type UserContextType = {
  user: any | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const data = await getUser();
    setUser(data);
  };

  useEffect(() => {
    const init = async () => {
      const data = await getUser();
      setUser(data);
      setLoading(false);
    };

    init();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};