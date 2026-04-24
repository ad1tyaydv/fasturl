"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getUser } from "@/lib/getUser";

type UserContextType = {
  user: any | null;
  loading: boolean;
  linksLeft: number;
  setLinksLeft: React.Dispatch<React.SetStateAction<number>>;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [linksLeft, setLinksLeft] = useState(0);
  const refreshUser = async () => {
    const data = await getUser();
    setUser(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getUser();

        if (data) {
          setUser(data);
          setLinksLeft(data.totalLinks ?? 0);

        } else {
          setUser(null);
          setLinksLeft(0);
        }

      } catch (err) {
        setUser(null);
        setLinksLeft(0);
        
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, linksLeft, setLinksLeft, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};