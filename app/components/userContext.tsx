"use client";

import { getUser } from "@/lib/getUser";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

type UserContextType = {
  user: any | null;
  setUser: (u: any | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isLoggingOut = useRef(false);

  const refreshUser = async () => {
    if (isLoggingOut.current) return;

    try {
      const data = await getUser();

      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }

    } catch (error) {
      console.log("Error refreshing user:");
      setUser(null);
    }
  };


  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();

        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }

      } catch (error) {
        console.log("Error fetching user:", error);
        setUser(null);

      } finally {
        setIsHydrated(true);
      }
    }
    fetchUser();

  }, []);


  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      refreshUser();
    }, 30000);

    return () => clearInterval(interval);
  }, [isHydrated]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);


  const logout = async () => {
    try {
      isLoggingOut.current = true;

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);

      localStorage.removeItem("user");

      setTimeout(() => {
        isLoggingOut.current = false;
      }, 1000);
      
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};