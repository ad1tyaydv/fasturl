'use client'

import { useSession } from "next-auth/react"

export default function UserInfo() {
  const { data: session } = useSession()

  if (!session) return <p>Not logged in</p>

  return (
    <div className="flex items-center gap-2">
      <p>Welcome {session.user?.name}</p>
      <img src={session.user?.image || ""} alt="Profile" className="w-10 h-10 rounded-full" />
    </div>
  )
}