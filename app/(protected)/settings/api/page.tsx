"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Copy, Trash2, Key, Settings2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "@/app/components/userContext";
import { UpgradeAlert } from "@/app/modals/upgradeAlert";

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
  const { user } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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

  const handleGenerateClick = () => {
    if (user?.plan !== "PRO") {
      setIsUpgradeModalOpen(true);
      return;
    }
    setIsModalOpen(true);
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
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error("Only PRO plan users can create API keys.");
      } else {
        toast.error("Failed to generate API key.");
      }
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
    <div className="animate-in fade-in duration-300 font-one">
      <UpgradeAlert 
        isOpen={isUpgradeModalOpen} 
        onClose={setIsUpgradeModalOpen} 
        onConfirm={() => router.push("/premium")} 
        title="PRO Feature"
        description="API key creation is only available for PRO plan users. Upgrade your plan to generate API keys and integrate FastURL with your applications."
      />
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">API Keys</h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Manage your API keys. Keep them secret — anyone with a key can
            access the API on your behalf.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => router.push("/apikeys")}
            className="bg-primary text-primary-foreground hover:opacity-90 font-bold px-6 py-2.5 rounded-lg gap-2 cursor-pointer transition-all shadow-md"
          >
            <Settings2 className="w-4 h-4" />
            Manage
          </Button>
          <Button
            onClick={handleGenerateClick}
            className="bg-primary text-primary-foreground hover:opacity-90 font-bold px-6 py-2.5 rounded-lg gap-2 cursor-pointer transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Generate Key
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading API keys...</span>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="border border-dashed border-border flex flex-col items-center justify-center py-16 text-center rounded-xl bg-secondary/30">
          <Key className="w-10 h-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium">No API keys yet</p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            Click &quot;Generate Key&quot; to create your first key.
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto rounded-xl bg-background shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Name</th>
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Key</th>
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Created</th>
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Usage</th>
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Status</th>
                <th className="text-left text-muted-foreground font-semibold px-5 py-3 uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((apiKey) => (
                <tr
                  key={apiKey.id ?? apiKey.key}
                  className="transition-colors hover:bg-accent/30"
                >
                  <td className="px-5 py-4 text-foreground font-medium">
                    {apiKey.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-muted-foreground font-mono text-xs bg-secondary/50 border border-border px-3 py-1.5 rounded select-none">
                        {maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => handleCopy(apiKey.key)}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(apiKey.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {apiKey.usageCount ?? 0} / {apiKey.usageLimit ?? "∞"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(apiKey.id ?? apiKey.key, apiKey.isActive)}
                      disabled={togglingId === apiKey.id}
                      className="flex items-center gap-2 cursor-pointer group disabled:opacity-60"
                      title={apiKey.isActive ? "Click to deactivate" : "Click to activate"}
                    >
                      {togglingId === (apiKey.id ?? apiKey.key) ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <div
                          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                            apiKey.isActive ? "bg-emerald-500" : "bg-muted"
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
                          apiKey.isActive ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground"
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
                      className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-60 p-2 hover:bg-destructive/10 rounded-lg"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative z-50 w-full max-w-md bg-popover border border-border p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {!generatedKey ? (
              <>
                <h3 className="text-foreground text-xl font-bold mb-1">
                  Generate API Key
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Give this key a name so you can identify it later.
                </p>

                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Key Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Production Server"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  disabled={isGenerating}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 rounded-lg mb-5"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 border-border text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !keyName.trim()}
                    className="flex-1 bg-primary text-primary-foreground font-bold rounded-lg gap-2 cursor-pointer transition-all hover:opacity-90"
                  >
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-foreground text-xl font-bold mb-1">
                  Key Generated
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Copy your API key now — it won't be shown again.
                </p>

                <div className="flex items-center gap-2 bg-secondary/50 border border-border px-4 py-3 mb-6 rounded-lg">
                  <code className="text-emerald-600 dark:text-emerald-500 font-mono text-sm flex-1 break-all select-all">
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => handleCopy(generatedKey)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 p-2 hover:bg-accent rounded-lg"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleCloseModal}
                  className="w-full bg-primary text-primary-foreground font-bold rounded-lg cursor-pointer transition-all hover:opacity-90"
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
