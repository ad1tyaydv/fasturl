

export default function Hero() {


  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6">
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
  );
}