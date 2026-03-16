"use client";

import { useState } from "react";
import axios from "axios";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");


  const generateQR = async () => {
    try {
      const res = await axios.post("/api/qrCode", {
        url
    });
      setQr(res.data.qr);

    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <div className="flex flex-col gap-4 max-w-md">

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={generateQR}
        className="bg-black text-white p-2 rounded"
      >
        Generate QR
      </button>

      {qr && (
        <div className="flex flex-col items-center gap-2">
          <img src={qr} alt="QR Code" />

          <a
            href={qr}
            download="qr-code.png"
            className="text-blue-500"
          >
            Download QR
          </a>
        </div>
      )}

    </div>
  );
}