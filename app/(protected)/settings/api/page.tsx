"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Copy, Trash2, Key, Settings2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface ApiKey {
  id?: string;
  name?: string;
  key: string;
  isActive: boolean;
  createdAt: string;
  usageCount?: number;
  usageLimit?: number;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/api_key/fetchApi_keys");
      setApiKeys(Array.isArray(res.data) ? res.data : (res.data.apiKeys ?? []));
    } catch (err) {
      toast.error("Failed to fetch API keys.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!keyName.trim()) return;
    try {
      setIsGenerating(true);
      const res = await axios.post("/api/api_key", { name: keyName.trim() });
      const newKey = res.data;
      setGeneratedKey(newKey.key ?? newKey.apiKey ?? null);
      await fetchApiKeys();
      toast.success("API key generated successfully.");
    } catch (err) {
      toast.error("Failed to generate API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setKeyName("");
    setGeneratedKey(null);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      await axios.post("/api/api_key/updateStatus", {
        id,
        isActive: !currentStatus,
      });
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, isActive: !currentStatus } : k
        )
      );
      toast.success(`Key ${!currentStatus ? "activated" : "deactivated"}.`);
    } catch (err) {
      toast.error("Failed to update key status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.post(`/api/api_key/deleteApi_key/${id}`);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success("API key deleted.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete key.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard.");
  };

  const maskKey = (key: string) => {
    if (!key) return "";
    const visible = key.slice(0, 8);
    return `${visible}${"•".repeat(24)}`;
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">API Keys</h2>
          <p className="text-gray-400 max-w-2xl text-sm">
            Manage your API keys. Keep them secret — anyone with a key can
            access the API on your behalf.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Updated Manage Button - Removed variant="outline" */}
          <Button
            onClick={() => router.push("/apikeys")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-none gap-2 cursor-pointer transition-all border-none"
          >
            <Settings2 className="w-4 h-4" />
            Manage
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-none gap-2 cursor-pointer transition-all border-none"
          >
            <Plus className="w-4 h-4" />
            Generate Key
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-gray-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium">Loading API keys...</span>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="border border-dashed border-gray-700 flex flex-col items-center justify-center py-16 text-center">
          <Key className="w-10 h-10 text-gray-600 mb-4" />
          <p className="text-gray-400 font-medium">No API keys yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Click &quot;Generate Key&quot; to create your first key.
          </p>
        </div>
      ) : (
        <div className="border border-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60">
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Name</th>
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Key</th>
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Created</th>
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Usage</th>
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Status</th>
                <th className="text-left text-gray-400 font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey, i) => (
                <tr
                  key={apiKey.id ?? apiKey.key}
                  className={`border-b border-gray-800 last:border-b-0 transition-colors hover:bg-gray-900/40 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-gray-900/20"
                  }`}
                >
                  <td className="px-5 py-4 text-white font-medium">
                    {apiKey.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-gray-400 font-mono text-xs bg-gray-900 border border-gray-800 px-3 py-1.5 select-none">
                        {maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => handleCopy(apiKey.key)}
                        className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(apiKey.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {apiKey.usageCount} / {apiKey.usageLimit}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(apiKey.id ?? apiKey.key, apiKey.isActive)}
                      disabled={togglingId === apiKey.id}
                      className="flex items-center gap-2 cursor-pointer group disabled:opacity-60"
                      title={apiKey.isActive ? "Click to deactivate" : "Click to activate"}
                    >
                      {togglingId === (apiKey.id ?? apiKey.key) ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <div
                          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                            apiKey.isActive ? "bg-blue-600" : "bg-gray-700"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              apiKey.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          apiKey.isActive ? "text-blue-400" : "text-gray-500"
                        }`}
                      >
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(apiKey.id ?? apiKey.key)}
                      disabled={deletingId === (apiKey.id ?? apiKey.key)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-60"
                      title="Delete key"
                    >
                      {deletingId === (apiKey.id ?? apiKey.key) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleCloseModal}
        >
          <div
            className="relative z-50 w-full max-w-md bg-gray-950 border border-gray-800 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {!generatedKey ? (
              <>
                <h3 className="text-white text-xl font-bold mb-1">
                  Generate API Key
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Give this key a name so you can identify it later.
                </p>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Production Server"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  disabled={isGenerating}
                  className="bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-none mb-5"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 rounded-none border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !keyName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none gap-2 cursor-pointer"
                  >
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-white text-xl font-bold mb-1">
                  Key Generated
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Copy your API key now — it won't be shown again.
                </p>

                <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-3 mb-6">
                  <code className="text-green-400 font-mono text-sm flex-1 break-all select-all">
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => handleCopy(generatedKey)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleCloseModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none cursor-pointer"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}