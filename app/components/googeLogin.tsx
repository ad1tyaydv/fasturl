'use client'

import { signIn } from "next-auth/react"

export default function GoogleLogin() {
  return (
    <button 
      onClick={() => signIn("google")}
      className="border px-4 py-2 rounded hover:bg-gray-100"
    >
      Continue with Google
    </button>
  )
}