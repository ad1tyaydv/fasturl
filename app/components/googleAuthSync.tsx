"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useUser } from "@/app/components/userContext";

export default function GoogleAuthSync() {

    const { data: session, status } = useSession();
    const { refreshUser } = useUser();

    const synced = useRef(false);

    useEffect(() => {

        async function syncToken() {

            if (
                status !== "authenticated" ||
                !session?.customToken ||
                synced.current
            ) {
                return;
            }

            synced.current = true;

            try {

                await axios.post("/api/auth/saveGoogleAuthToken", {
                    token: session.customToken,
                });

                await refreshUser();

            } catch (error) {
                console.log(error);
            }
        }

        syncToken();

    }, [session, status]);

    return null;
}