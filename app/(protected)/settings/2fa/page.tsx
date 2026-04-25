"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// Shadcn Input OTP Components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";

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
        console.log("Error while 2fa check");

      } finally {
        setloading(false);
      }
    };
    check2fa();

  }, []);


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

      await axios.post("/api/auth/2fa/verify", { otp: otp });
      setIsEnabled(true);
      setIsModalOpen(false);
      setQrCode(null);
      toast.success("Two-factor authentication enabled successfully.");

    } catch (err) {
      setError("Verification failed. Check your code.");

    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable = async () => {
    try {
      setIsDisabling(true);
      await axios.post("/api/auth/2fa/disable");
      setIsEnabled(false);
      toast.success("Two-factor authentication disabled.");

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disable 2FA");

    } finally {
      setIsDisabling(false);
    }
  };

  
  return (
    <div className="animate-in fade-in duration-300 font-one">
      <h2 className="text-2xl font-bold text-white mb-4">
        Two-Factor Authentication
      </h2>
      <p className="text-neutral-400 mb-8 max-w-2xl leading-relaxed">
        Protect your account with an extra layer of security. Once configured,
        you'll be required to enter both your password and an authentication
        code from your mobile phone in order to sign in.
      </p>

      <div className="min-h-[44px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-3 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#1D9BF0]" />
            <span className="text-sm font-medium">Checking security status...</span>
          </div>
        ) : isEnabled ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm font-bold">
              <ShieldCheck size={18} />
              2FA IS ACTIVE
            </div>
            <Button
              onClick={handleDisable}
              disabled={isDisabling}
              variant="outline"
              className="border-neutral-800 text-red-500 hover:bg-red-500/10 hover:border-red-500 font-bold px-8 py-2.5 cursor-pointer rounded-xl transition-all"
            >
              {isDisabling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disable 2FA"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-neutral-200 font-bold px-10 py-6 text-base cursor-pointer rounded-xl transition-all shadow-lg"
          >
            Enable 2FA Now
          </Button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative z-50 w-full max-w-lg bg-[#0F0F0F] border border-zinc-800 p-6 sm:p-10 rounded-2xl shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors sm:hidden cursor-pointer"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-bold">Back</span>
              </button>
              <h3 className="hidden sm:block text-white text-xl font-bold">
                Setup 2FA
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="hidden sm:block text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center sm:text-left mb-8">
              <p className="text-neutral-400 text-sm leading-relaxed">
                Scan this QR code with Google Authenticator or Authy, then enter the code below.
              </p>
            </div>

            <div className="flex justify-center mb-10">
              {isLoading ? (
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1D9BF0]" />
                </div>
              ) : qrCode ? (
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-white/5">
                   <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="w-44 h-44 sm:w-48 sm:h-48"
                  />
                </div>
              ) : null}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 text-sm mb-6 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                  6-Digit Verification Code
                </label>
                
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={(val) => setOtp(val)}
                  disabled={isVerifying}
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[...Array(6)].map((_, i) => (
                      <React.Fragment key={i}>
                        <InputOTPSlot 
                          index={i} 
                          className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-zinc-800 bg-zinc-900/50 text-2xl font-bold focus:border-[#1D9BF0] focus:ring-4 focus:ring-[#1D9BF0]/10 transition-all text-white" 
                        />
                        {i === 2 && <InputOTPSeparator className="text-zinc-700 mx-1" />}
                      </React.Fragment>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || otp.length < 6}
                className="bg-[#1D9BF0] hover:bg-blue-600 text-white font-bold w-full py-7 text-lg rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer "
              >
                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & Enable"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}