"use client";

import { getUser } from "@/lib/getUser";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserContextType = {
    user: any | null;
    setUser: (u: any) => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    const refreshUser = async () => {
        try {
            const data = await getUser();
            if (data) {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));

            } else {
                setUser(null);
                localStorage.removeItem("user");
            }

        } catch (error) {
            console.log("Error refreshing user:", error);
        }
    };

    useEffect(() => {
        async function fetchUser() {
            try {
            
                const stored = localStorage.getItem("user");
                if (stored) {
                    try {
                        const parsedUser = JSON.parse(stored);
                        setUser(parsedUser);

                    } catch (parseError) {
                        console.log("Error parsing stored user:", parseError);
                        localStorage.removeItem("user");
                    }
                }
            
                const data = await getUser();
                if (data) {
                    setUser(data);
                    localStorage.setItem("user", JSON.stringify(data));

                } else {
                    setUser(null);
                    localStorage.removeItem("user");
                }

            } catch (error) {
                console.log("Error fetching user:", error);

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
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
        
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser }}>
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