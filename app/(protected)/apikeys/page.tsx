"use client";

import { useRouter } from "next/navigation";


export default function Apikeys() {
    const router = useRouter()

    router.push("/apikeys?type=allkeys")
}