"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [updateUserName, setUpdateUserName] = useState("");
  const [updateUserNameLoader, setUpdateUserNameLoader] = useState(false);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateEmailLoader, setUpdateEmailLoader] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUserName(res.data.userName || "");
        setEmail(res.data.email || "");
        setUpdateUserName(res.data.userName || "");
        setUpdateEmail(res.data.email || "");
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateUserName = async () => {
    if (!updateUserName.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setUpdateUserNameLoader(true);
    try {
      await axios.post("/api/auth/update/userName", {
        userName: updateUserName,
      });
      setUserName(updateUserName);
      toast.success("Username updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating username");
    } finally {
      setUpdateUserNameLoader(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!updateEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    setUpdateEmailLoader(true);
    try {
      await axios.post("/api/auth/update/email", {
        email: updateEmail,
      });
      setEmail(updateEmail);
      toast.success("Email updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating email");
    } finally {
      setUpdateEmailLoader(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") {
      callback();
    }
  };

  return (
    <div className="pl-6">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-6 pr-96">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-300">Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={updateUserName}
              onChange={(e) => setUpdateUserName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateUserName)}
              placeholder="Enter your username"
              className="flex-1 bg-white text-black px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUpdateUserName}
              disabled={updateUserNameLoader}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {updateUserNameLoader ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-300">Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleUpdateEmail)}
              placeholder="Enter your email"
              className="flex-1 bg-white text-black px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUpdateEmail}
              disabled={updateEmailLoader}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {updateEmailLoader ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}