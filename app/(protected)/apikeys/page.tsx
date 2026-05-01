"use client";

import { useRouter } from "next/navigation";


export default function Apikeys() {
    const router = useRouter()

    router.prefetch("/apikeys?type=allkeys")
}