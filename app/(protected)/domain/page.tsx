"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert, Loader2
} from "lucide-react";

import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon, Search01Icon, Globe02Icon, ArrowDown01Icon, CopyIcon,
  CopyCheckIcon, Delete02Icon
} from '@hugeicons/core-free-icons';

import { Toaster, toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "../../components/navbar";
import { SkeletonLoader } from "@/app/loaders/links";
import AddDomainModal from "@/app/modals/addDomainModal";
import { FilterDomainDropDown, DomainFilterType } from "@/app/dropDown/filterDomainDropDown";
import { useUser } from "@/app/components/userContext";

export default function DomainsPage() {
  const router = useRouter();
  const { user } = useUser();

  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState<string>("FREE");
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<DomainFilterType>("all");
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const plan = user?.plan;
        setUserTier(plan);

        if (plan !== "") {
          setIsLoggedIn(true);

        } else {
          router.push("/auth/signin");
        }

      } catch {
        router.push("/auth/signin");
      }
    };
    initAuth();

  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDomains();
    }
  }, [isLoggedIn, fetchDomains]);

  const handleConnectClick = () => {
    if (userTier === "FREE") {
      toast.error("Custom domains are not available on the Free plan.");
      router.push("/premium");

    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddDomain = async (domainName: string) => {
    try {
      setIsAdding(true);
      const res = await axios.post("/api/domain/addDomain", {
        domain: domainName
      });

      toast.success("Domain added successfully");
      setIsModalOpen(false);
      await fetchDomains();

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to add domain";
      toast.error(errorMsg);

      if (error.response?.status === 401) {
        // router.push("/premium"); 
      }

    } finally {
      setIsAdding(false);
    }
  };

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
      toast.error("DNS records not found yet, Try again.");

    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await axios.post(`/api/domain/deleteDomain/${id}`);
      toast.success("Domain deleted successfully");
      fetchDomains();
      
    } catch (error) {
      toast.error("Error while deleting domain");
    }
  };

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredDomains = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return domains
      .filter((d) => {
        const full = `${d.subDomain ? d.subDomain + '.' : ''}${d.domain}`.toLowerCase();
        const matchesSearch =
          d.domain?.toLowerCase().includes(q) ||
          d.subDomain?.toLowerCase().includes(q) ||
          full.includes(q);
        const matchesFilter =
          domainFilter === "all" ||
          (domainFilter === "verified" && d.isActive) ||
          (domainFilter === "unverified" && !d.isActive);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [domains, searchQuery, domainFilter]);

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedData = filteredDomains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster position="bottom-center" />
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-border pb-4 sm:pb-6">
          <div className="text-2xl sm:text-4xl font-one tracking-tight">Custom Domains</div>
          <div className="flex items-center gap-3">
            {domains.length > 0 && (
              <span className="hidden sm:block px-4 py-1.5 font-three bg-secondary border border-border rounded-lg text-xs text-muted-foreground">
                TOTAL - {domains.length}
              </span>
            )}
            <Button
              onClick={handleConnectClick}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 font-three py-4 rounded-lg cursor-pointer shadow-md"
            >
              <HugeiconsIcon icon={PlusSignIcon} /> Connect Domain
            </Button>
          </div>
        </div>

        <AddDomainModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddDomain}
          isAdding={isAdding}
        />

        {domains.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="relative w-full sm:w-[400px]">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by domain or subdomain..."
                className="bg-background font-one border-border pl-10 h-11 w-full focus-visible:ring-1 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <FilterDomainDropDown value={domainFilter} onChange={setDomainFilter} />
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonLoader />
        ) : domains.length === 0 ? (
          <div className="w-full py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/30">
            <div className="p-4 bg-secondary rounded-2xl border border-border mb-6">
              <HugeiconsIcon icon={Globe02Icon} className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-one mb-2 text-foreground">Connect your first custom domain</h2>
            <p className="text-muted-foreground font-three text-sm mb-8 text-center max-w-md leading-relaxed">
              Build brand authority and trust by using your own domain name for your links and projects.
            </p>
            <Button
              onClick={handleConnectClick}
              className="bg-primary text-primary-foreground hover:opacity-90 font-three px-8 py-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="w-5 h-5" /> Add Domain
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedData.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isVerifying = verifyingId === item.domain;
              const fullDomain = item.subDomain ? `${item.subDomain}.${item.domain}` : item.domain;

              return (
                <div key={index} className={`overflow-hidden rounded-2xl bg-secondary/50 border transition-all duration-300 ${isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-muted-foreground/30'}`}>
                  <div onClick={() => setExpandedId(isExpanded ? null : item.id)} className="flex items-center font-three justify-between p-4 sm:p-5 cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                      <div className="p-2.5 sm:p-3.5 rounded-xl bg-background border border-border shrink-0 mt-1 sm:mt-0">
                        <HugeiconsIcon icon={Globe02Icon} className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex flex-col min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                          <h3 className="font-one text-base sm:text-lg truncate text-foreground">{fullDomain}</h3>
                          {item.isActive ? (
                            <span className="w-max flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase shrink-0">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 font-three uppercase">
                                <ShieldAlert className="w-3 h-3" /> Pending
                              </span>
                              <Button
                                size="sm"
                                disabled={isVerifying}
                                onClick={(e) => handleVerify(e, fullDomain)}
                                className="h-7 px-3 text-[12px] bg-primary text-primary-foreground hover:opacity-90 font-three rounded-md cursor-pointer"
                              >
                                {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify Now"}
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground font-three mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 pl-2">
                      <HugeiconsIcon icon={ArrowDown01Icon} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      <Button
                        variant="ghost" size="icon"
                        className="text-muted-foreground hover:text-destructive ml-0 sm:ml-2 cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
                        onClick={(e) => { e.stopPropagation(); handleDeleteDomain(item.id) }}
                      >
                        <HugeiconsIcon icon={Delete02Icon} />
                      </Button>
                    </div>
                  </div>

                  <div className={`px-4 sm:px-5 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] pb-6 opacity-100 border-t border-border pt-6 bg-background/50' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verification (TXT Record)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div onClick={() => handleCopy(item.txtName, "TXT Host")} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group/item transition-colors">
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold">Type / Host</span>
                              <span className="text-sm font-three text-foreground truncate">TXT / {item.txtName || "N/A"}</span>
                            </div>
                            {copiedField === "TXT Host" ? <HugeiconsIcon icon={CopyCheckIcon} className="text-emerald-500 w-4 h-4 shrink-0" /> : <HugeiconsIcon icon={CopyIcon} className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </div>
                          <div onClick={() => handleCopy(item.txtValue, "TXT Value")} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group/item transition-colors">
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold">Value</span>
                              <span className="text-sm font-three text-foreground truncate">{item.txtValue || "N/A"}</span>
                            </div>
                            {copiedField === "TXT Value" ? <HugeiconsIcon icon={CopyCheckIcon} className="text-emerald-500 w-4 h-4 shrink-0" /> : <HugeiconsIcon icon={CopyIcon} className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Routing (CNAME Record)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div onClick={() => handleCopy(item.subDomain, "CNAME Host")} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group/item transition-colors">
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold">Type / Host</span>
                              <span className="text-sm font-three text-foreground truncate">CNAME / {item.subDomain}</span>
                            </div>
                            {copiedField === "CNAME Host" ? <HugeiconsIcon icon={CopyCheckIcon} className="text-emerald-500 w-4 h-4 shrink-0" /> : <HugeiconsIcon icon={CopyIcon} className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </div>
                          <div onClick={() => handleCopy(item.cnameTarget, "CNAME Target")} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group/item transition-colors">
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold">Value / Target</span>
                              <span className="text-sm font-three text-foreground truncate">{item.cnameTarget || "N/A"}</span>
                            </div>
                            {copiedField === "CNAME Target" ? <HugeiconsIcon icon={CopyCheckIcon} className="text-emerald-500 w-4 h-4 shrink-0" /> : <HugeiconsIcon icon={CopyIcon} className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] italic font-three text-muted-foreground mt-4 leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/50">
                        <span className="text-foreground font-bold not-italic">Pro Tip:</span> Add these records in your DNS settings. TXT is for ownership verification, and CNAME points your domain traffic to our servers.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {domains.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-10">
            <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="bg-secondary border-border disabled:opacity-30 cursor-pointer"><ChevronLeft size={18} /></Button>
            <span className="text-sm font-bold text-muted-foreground">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="bg-secondary border-border disabled:opacity-30 cursor-pointer"><ChevronRight size={18} /></Button>
          </div>
        )}
      </main>
    </div>
  );
}