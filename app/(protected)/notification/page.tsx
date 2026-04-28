"use client";

import Navbar from "@/app/components/navbar";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Notification01Icon, 
  Tick02Icon, 
  Delete02Icon, 
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  Mail01Icon,
  Calendar03Icon
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { useUser } from "@/app/components/userContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

export default function NotificationPage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  const [processingRead, setProcessingRead] = useState<string | null>(null);
  const [processingDelete, setProcessingDelete] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notification/fetch");
      if (res.status === 200) {
        setNotifications(res.data.notifications);
      }

    } catch (error) {
      console.error("Failed to fetch notifications");
      toast.error("Failed to load notifications");

    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");

    } else if (user) {
      fetchNotifications();
    }

  }, [user, loading, router]);


  const markAsRead = async (id: string) => {
    setProcessingRead(id);

    try {
      const res = await axios.post("/api/notification/markRead", { id });
      if (res.status === 200) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

        toast.success("Notification marked as read");
        refreshUser();
      }

    } catch (error) {
      toast.error("Failed to update notification");

    } finally {
      setProcessingRead(null);
    }
  };


  const markAllAsRead = async () => {
    setIsMarkingAll(true);

    try {
      const res = await axios.post("/api/notification/markRead", { markAllAsRead: true });
      if (res.status === 200) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
        refreshUser();
      }

    } catch (error) {
      toast.error("Failed to update notifications");

    } finally {
      setIsMarkingAll(false);
    }
  };


  const deleteNotification = async (id: string) => {
    setProcessingDelete(id);
    try {
      const res = await axios.post("/api/notification/delete", { id });

      if (res.status === 200) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification deleted");
        refreshUser();
      }

    } catch (error) {
      toast.error("Failed to delete notification");

    } finally {
      setProcessingDelete(null);
    }
  };


  const deleteAllNotifications = async () => {
    if (!confirm("Are you sure you want to delete all notifications?")) return;
    setIsClearingAll(true);
    
    try {
      const res = await axios.post("/api/notification/delete", { deleteAll: true });
      if (res.status === 200) {
        setNotifications([]);
        toast.success("All notifications deleted");
        refreshUser();
      }

    } catch (error) {
      toast.error("Failed to delete notifications");

    } finally {
      setIsClearingAll(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("success") || t.includes("verified") || t.includes("upgraded") || t.includes("plan")) return CheckmarkCircle02Icon;
    if (t.includes("error") || t.includes("failed")) return Alert02Icon;
    if (t.includes("2fa") || t.includes("security")) return InformationCircleIcon;
    if (t.includes("welcome")) return Mail01Icon;
    return Notification01Icon;
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" ? true : filter === "read" ? n.isRead : !n.isRead;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-three">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <HugeiconsIcon icon={Notification01Icon} className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-one font-bold tracking-tight text-white">Notifications</h1>
              <p className="text-neutral-400 text-sm mt-1">
                Manage your account activity and latest updates.
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-3">
              <Button 
                onClick={markAllAsRead}
                disabled={isMarkingAll}
                className="bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-xs h-10 px-5 cursor-pointer transition-all"
              >
                {isMarkingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />}
                Mark all read
              </Button>
              <Button 
                variant="destructive"
                onClick={deleteAllNotifications}
                disabled={isClearingAll}
                className="rounded-xl text-white font-bold text-xs h-10 px-5 cursor-pointer transition-all border bg-red-500 hover:bg-red-600"
              >
                {isClearingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4 mr-2 text-white" />}
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-[#1c1c1c]/50 p-4 rounded-2xl border border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search notifications..."
              className="pl-10 bg-white/5 border-white/10 text-white rounded-xl h-11 focus-visible:ring-0 focus-visible:border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
            {(["all", "read", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === f
                    ? "bg-white text-black shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1c1c1c]/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="flex items-center px-8 py-4 bg-white/5 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-white">
            <div className="w-12">Status</div>
            <div className="flex-1 px-4">Notification</div>
            <div className="w-48 px-4 hidden md:block">Date</div>
            <div className="w-32 text-right">Actions</div>
          </div>

          {fetching ? (
            <div className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center px-8 py-6">
                  <Skeleton className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="flex-1 px-6 space-y-2">
                    <Skeleton className="h-4 w-1/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/5" />
                  </div>
                  <Skeleton className="w-32 h-8 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
          ) : paginatedNotifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {paginatedNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex items-center px-8 py-6 group ${
                    notification.isRead ? "opacity-60" : "bg-blue-500/[0.02]"
                  }`}
                >
                  <div className="w-12 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      notification.isRead 
                        ? "bg-neutral-900 border-white/5 text-neutral-500" 
                        : "bg-white text-black border-white"
                    }`}>
                      <HugeiconsIcon icon={getIcon(notification.title)} className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 px-4 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-one font-bold text-lg truncate ${notification.isRead ? "text-neutral-400" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${notification.isRead ? "text-neutral-500" : "text-neutral-300"}`}>
                      {notification.message}
                    </p>
                    <div className="md:hidden flex items-center gap-2 mt-2 text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">
                      <HugeiconsIcon icon={Calendar03Icon} className="w-3 h-3" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  <div className="w-48 px-4 hidden md:block flex-shrink-0">
                    <div className="text-sm font-medium text-neutral-500">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  <div className="w-32 flex-shrink-0 flex items-center justify-end gap-2">
                    {!notification.isRead && (
                      <Button 
                        size="icon"
                        variant="ghost"
                        disabled={processingRead === notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className="w-9 h-9 bg-white text-black hover:bg-neutral-200 rounded-lg cursor-pointer border border-white transition-all shadow-lg shadow-white/5"
                        title="Mark as read"
                      >
                        {processingRead === notification.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                        ) : (
                          <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button 
                      size="icon"
                      variant="ghost"
                      disabled={processingDelete === notification.id}
                      onClick={() => deleteNotification(notification.id)}
                      className="w-9 h-9 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg cursor-pointer border border-white/5 transition-all"
                      title="Delete"
                    >
                      {processingDelete === notification.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white/[0.01]">
              <div className="w-20 h-20 bg-neutral-900 rounded-3xl border border-white/5 flex items-center justify-center mb-6">
                <HugeiconsIcon icon={Notification01Icon} className="w-10 h-10 text-neutral-700" />
              </div>
              <h2 className="text-2xl font-one font-bold mb-2 text-white">
                {searchQuery || filter !== "all" ? "No matches found" : "All caught up!"}
              </h2>
              <p className="text-neutral-500 text-sm text-center max-w-xs px-6">
                {searchQuery || filter !== "all" 
                  ? "Try adjusting your search or filters to find what you're looking for." 
                  : "No new notifications at the moment. We'll alert you when something important happens."}
              </p>
              {(searchQuery || filter !== "all") && (
                <Button 
                  onClick={() => {setSearchQuery(""); setFilter("all");}}
                  variant="link" 
                  className="text-blue-500 mt-4 h-auto p-0 cursor-pointer"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join bg-[#1c1c1c] border border-white/5 rounded-xl overflow-hidden flex items-center">
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="join-item px-4 py-2 hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-r border-white/5 h-10 flex items-center justify-center font-bold text-lg"
              >
                «
              </button>
              <button className="join-item px-6 py-2 bg-white/5 text-white h-10 flex items-center justify-center font-bold text-xs uppercase tracking-widest cursor-pointer">
                Page {currentPage}
              </button>
              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="join-item px-4 py-2 hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-l border-white/5 h-10 flex items-center justify-center font-bold text-lg"
              >
                »
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
