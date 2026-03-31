"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, ChevronRight, Plus, Globe, Trash2, 
  ShieldCheck, ShieldAlert, Search, 
  Copy, Check, ChevronDown, Loader2 
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "../../components/navbar";
import { SkeletonLoader } from "@/app/loaders/links";
import ConnectDomainModal from "@/app/modals/addDomainModal";


export default function DomainsPage() {
  const router = useRouter();

  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/domain/fetchDomain");
      setDomains(res.data.userDomains || []);

    } catch (err) {
      toast.error("Failed to load domains");
      
    } finally {
      setLoading(false);
    }
  }, []);


  const handleVerify = async (e: React.MouseEvent, domainName: string) => {
    e.stopPropagation();
    try {
      setVerifyingId(domainName);
      const res = await axios.post("/api/domain/verifyDomain", { domain: domainName });
      
      if (res.status === 200) {
        toast.success("Domain verified successfully!");
        await fetchDomains();
      }

    } catch (error: any) {
      toast.error("DNS records not found yet. Try again later.");

    } finally {
      setVerifyingId(null);
    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      fetchDomains();
    }
  }, [isLoggedIn]);


  const handleAddDomain = async (domainName: string) => {
    try {
      setIsAdding(true);
      await axios.post("/api/domain/addDomain", { domain: domainName });
      toast.success("Domain added successfully");
      await fetchDomains();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add domain");

    } finally {
      setIsAdding(false);
    }
  };


  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };


  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data.authenticated) setIsLoggedIn(true);
        else router.push("/auth/signin");

      } catch { router.push("/auth/signin"); }
    };
    initAuth();

  }, [router]);


  const filteredDomains = useMemo(() => {
    return domains.filter((d) =>
      d.domain?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  }, [domains, searchQuery]);


  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedData = filteredDomains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Toaster position="bottom-center" />
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
          <div className="text-2xl sm:text-4xl font-one tracking-tight">Custom Domains</div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block px-4 py-1.5 font-bold bg-[#1c1c1c] border border-neutral-700 rounded-lg text-xs">
              TOTAL - {filteredDomains.length}
            </span>
            <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-neutral-200 font-bold px-6 py-2 rounded-lg">
              <Plus className="w-4 h-4 mr-2" /> Connect Domain
            </Button>
          </div>
        </div>

        <ConnectDomainModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddDomain} 
          isAdding={isAdding} 
        />

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input 
            placeholder="Search your domains..." 
            className="bg-[#1c1c1c] border-neutral-800 pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? <SkeletonLoader /> : (
          <div className="space-y-4">
            {paginatedData.map((item, index) => {
              const isExpanded = expandedId === item.domain;
              const isVerifying = verifyingId === item.domain;

              return (
                <div key={index} className={`overflow-hidden rounded-2xl bg-[#1c1c1c] border transition-all duration-300 ${isExpanded ? 'border-neutral-500 shadow-lg' : 'border-neutral-800 hover:border-neutral-700'}`}>
                  <div onClick={() => setExpandedId(isExpanded ? null : item.domain)} className="flex items-center justify-between p-5 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-xl bg-[#141414] border border-neutral-800 group-hover:border-neutral-700">
                        <Globe className={`w-6 h-6 transition-colors ${isExpanded ? 'text-white' : 'text-neutral-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{item.domain}</h3>
                          
                          {item.verified ? (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase">
                                <ShieldAlert className="w-3 h-3" /> Pending
                              </span>
                              
                              {/* Verify Button - Conditionally Rendered */}
                              <Button 
                                size="sm" 
                                disabled={isVerifying}
                                onClick={(e) => handleVerify(e, item.domain)}
                                className="h-7 px-3 text-[10px] bg-white text-black hover:bg-neutral-200 font-bold rounded-md"
                              >
                                {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify Now"}
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Added {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-red-500 ml-2"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className={`px-5 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] pb-6 opacity-100 border-t border-neutral-800/50 pt-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Type / Host</label>
                        <div onClick={() => handleCopy("TXT / @", "Host")} className="flex items-center justify-between bg-[#141414] p-3 rounded-lg border border-neutral-800 cursor-pointer hover:bg-neutral-900 group/item">
                          <span className="text-sm font-mono text-neutral-300">TXT / @</span>
                          {copiedField === "Host" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-neutral-600 group-hover/item:text-neutral-400" />}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">TXT Value (Token)</label>
                        <div onClick={() => handleCopy(item.token, "Token")} className="flex items-center justify-between bg-[#141414] p-3 rounded-lg border border-neutral-800 cursor-pointer hover:bg-neutral-900 group/item">
                          <span className="text-sm font-mono text-neutral-300 truncate mr-4">{item.token || "N/A"}</span>
                          {copiedField === "Token" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-neutral-600 group-hover/item:text-neutral-400" />}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs italic text-neutral-500 mt-4 leading-relaxed">
                      Paste these values in your domain provider (e.g., Cloudflare, Namecheap) DNS settings to verify.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="bg-neutral-800 border-neutral-700 disabled:opacity-30"><ChevronLeft size={18} /></Button>
            <span className="text-sm font-bold text-neutral-400">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="bg-neutral-800 border-neutral-700 disabled:opacity-30"><ChevronRight size={18} /></Button>
          </div>
        )}
      </main>
    </div>
  );
}