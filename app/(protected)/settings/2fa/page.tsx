"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

export default function TwoFactorPage() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setloading] = useState(false);


  useEffect(() => {
    if (isModalOpen) {
      fetchQrCode();

    } else {
      setOtp("");
      setError(null);
    }

  }, [isModalOpen]);


  useEffect(() => {
    const check2fa = async () => {
      setloading(true);

      try {
        const res = await axios.get("/api/auth/me");
        
        setIsEnabled(res.data.twofactorEnabled);

      } catch (error) {
        console.log("Error while 2fa check")

      } finally {
        setloading(false);
      }
    }
    check2fa();

  }, [])


  const fetchQrCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get("/api/auth/2fa");

      const data = res.data;
      setQrCode(data.qrCode || data.url || null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");

    } finally {
      setIsLoading(false);
    }
  };


  const handleVerify = async () => {
    if (otp.length < 6) return;
    try {
      setIsVerifying(true);
      setError(null);

      const res = await axios.post("/api/auth/2fa/verify", {
        otp: otp
      });

      setIsEnabled(true);
      setIsModalOpen(false);
      setQrCode(null);

      toast.success("Two-factor authentication enabled successfully.");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");

    } finally {
      setIsVerifying(false);
    }
  };


  const handleDisable = async () => {
    try {
      setIsDisabling(true);

      await axios.post("/api/auth/2fa/disable")

      setIsEnabled(false);
      toast.success("Two-factor authentication disabled.");

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disable 2FA");

    } finally {
      setIsDisabling(false);
    }
  };


  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-white mb-4">
        Two-Factor Authentication
      </h2>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Protect your account with an extra layer of security. Once configured,
        you'll be required to enter both your password and an authentication
        code from your mobile phone in order to sign in.
      </p>

      <div className="min-h-[44px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Checking security status...</span>
          </div>
        ) : isEnabled ? (
          <Button
            onClick={handleDisable}
            disabled={isDisabling}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2.5 w-full sm:w-fit cursor-pointer rounded-none gap-2 transition-all"
          >
            {isDisabling && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDisabling ? "Disabling..." : "Disable"}
          </Button>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 w-full sm:w-fit cursor-pointer rounded-none transition-all"
          >
            Enable
          </Button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative z-50 w-full max-w-lg bg-gray-950 border border-gray-800 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-xl font-bold mb-1">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Scan the QR code with your authenticator app, then enter the 6-digit code to verify.
            </p>

            <div className="flex justify-center mb-6">
              {isLoading ? (
                <div className="w-52 h-52 bg-gray-900 border border-gray-700 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : qrCode ? (
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  className="w-52 h-52 border border-gray-700"
                />
              ) : null}
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-2 text-sm mb-4">
                {error}
              </div>
            )}

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter OTP
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              maxLength={6}
              disabled={isVerifying}
              className="text-center text-2xl tracking-widest bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-none mb-4"
            />

            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.length < 6}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full rounded-none gap-2"
            >
              {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}