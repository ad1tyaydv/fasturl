'use client'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserInfo from "../components/userInfo";


export default function HomePage() {
    const router = useRouter();

  return (
    <div className="bg-white min-h-screen">

      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-xl font-semibold text-black">
          ShortURL
        </h1>

        <UserInfo />

        <button 
            className="border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition"
            onClick={() => router.push("/auth/signin")}
        >
          Login
        </button>
      </nav>

      <section className="flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-2xl w-full">

          <h1 className="text-5xl font-bold text-black mb-4">
            Shorten Your Links Instantly
          </h1>

          <p className="text-gray-600 mb-8">
            Turn long and messy URLs into short, clean links you can easily share.
          </p>

          <div className="flex gap-2 border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="flex-1 outline-none px-3 py-2 text-black"
            />

            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900">
              Shorten
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Free. Fast. No signup required.
          </p>

        </div>
      </section>

    </div>
  );
}