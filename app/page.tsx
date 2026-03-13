'use client'

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <nav className="flex items-center justify-between px-8 py-5 border-b">
        <h1 className="text-xl font-semibold tracking-tight">
          Shortly
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-sm text-gray-600 hover:text-black transition cursor-pointer"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/auth/signup")}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>


      <section className="flex-1 flex items-center justify-center px-6">

        <div className="max-w-4xl text-center">

          <h1 className="text-6xl font-bold leading-tight text-black">
            Shorten Your Links  
            <span className="block">
              Share Them Anywhere
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Turn long messy URLs into short, clean links you can share instantly. 
            Simple, fast, and built for developers.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">

            <button
              onClick={() => router.push("/dashboard")}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition cursor-pointer"
            >
              Start Shortening
            </button>

            <button
              onClick={() => router.push("/auth/signup")}
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Create Account
            </button>

          </div>


          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

            <div>
              <h3 className="font-semibold text-black">⚡ Lightning Fast</h3>
              <p className="text-gray-600 text-sm mt-2">
                Generate short links instantly with our high-performance API.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black">🔗 Clean Links</h3>
              <p className="text-gray-600 text-sm mt-2">
                Create beautiful short URLs that are easy to remember and share.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black">🔒 Secure</h3>
              <p className="text-gray-600 text-sm mt-2">
                Your links and data are protected with secure authentication.
              </p>
            </div>

          </div>

        </div>

      </section>


      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Shortly. All rights reserved.
      </footer>

    </div>
  );
}