"use client";

import { getUser } from "@/lib/getUser";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserContextType = {
    user: any | null;
    setUser: (u: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser ] = useState<any | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const stored = localStorage.getItem("user");
            if(stored) {
                setUser(JSON.stringify(stored));
                return;
            }

            try {
                const data = await getUser();
                if(data) {
                    localStorage.setItem("user", JSON.stringify(data));
                }

            } catch (error) {
                console.log(Error);
            }
        }
        fetchUser();

    }, [])

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};