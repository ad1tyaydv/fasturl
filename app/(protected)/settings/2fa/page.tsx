"use client";

import { Button } from "@/components/ui/button"; 

export default function TwoFactorPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-neutral-200 mb-4">
          Two-Factor Authentication
        </h2>
        <p className="text-neutral-400 mb-8 max-w-2xl">
          Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.
        </p>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 w-full sm:w-fit cursor-pointer">
          Enable
        </Button>
      </div>
    </div>
  );
}