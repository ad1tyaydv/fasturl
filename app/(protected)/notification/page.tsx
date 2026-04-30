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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-three overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-border shrink-0">
              <HugeiconsIcon icon={Notification01Icon} className="text-foreground w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-one font-bold tracking-tight text-foreground">Notifications</h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Manage your account activity and latest updates.
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={markAllAsRead}
                disabled={isMarkingAll}
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs h-10 px-2 sm:px-5 cursor-pointer transition-all w-full sm:w-auto"
              >
                {isMarkingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />}
                Mark all read
              </Button>
              <Button 
                variant="destructive"
                onClick={deleteAllNotifications}
                disabled={isClearingAll}
                className="rounded-lg sm:rounded-xl text-destructive-foreground font-bold text-[10px] sm:text-xs h-10 px-2 sm:px-5 cursor-pointer transition-all border bg-red-500 hover:bg-red-600 w-full sm:w-auto"
              >
                {isClearingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-current" />}
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-10 bg-muted/50 border-border text-foreground rounded-lg sm:rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg sm:rounded-xl border border-border w-full md:w-auto">
            {(["all", "read", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-3 sm:px-6 py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-xl">
          <div className="flex items-center px-4 sm:px-8 py-4 bg-muted/50 border-b border-border text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div className="w-10 sm:w-12 shrink-0">Status</div>
            <div className="flex-1 px-2 sm:px-4">Notification</div>
            <div className="w-48 px-4 hidden md:block">Date</div>
            <div className="w-24 sm:w-32 text-right shrink-0">Actions</div>
          </div>

          {fetching ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center px-4 sm:px-8 py-6">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 px-4 sm:px-6 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="w-24 sm:w-32 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : paginatedNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {paginatedNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex items-center px-4 sm:px-8 py-5 sm:py-6 group transition-colors hover:bg-muted/30 ${
                    notification.isRead ? "opacity-60" : "bg-primary/[0.03]"
                  }`}
                >
                  <div className="w-10 sm:w-12 flex-shrink-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border transition-all ${
                      notification.isRead 
                        ? "bg-muted border-border text-muted-foreground" 
                        : "bg-primary text-primary-foreground border-primary"
                    }`}>
                      <HugeiconsIcon icon={getIcon(notification.title)} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <div className="flex-1 px-2 sm:px-4 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <h3 className={`font-one font-bold text-sm sm:text-lg truncate ${notification.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none ${notification.isRead ? "text-muted-foreground" : "text-foreground/80"}`}>
                      {notification.message}
                    </p>
                    <div className="md:hidden flex items-center gap-1.5 mt-2 text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                      <HugeiconsIcon icon={Calendar03Icon} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  <div className="w-48 px-4 hidden md:block flex-shrink-0">
                    <div className="text-sm font-medium text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  <div className="w-24 sm:w-32 flex-shrink-0 flex items-center justify-end gap-1.5 sm:gap-2">
                    {!notification.isRead && (
                      <Button 
                        size="icon"
                        variant="outline"
                        disabled={processingRead === notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg cursor-pointer transition-all shadow-sm"
                        title="Mark as read"
                      >
                        {processingRead === notification.id ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <HugeiconsIcon icon={Tick02Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    )}
                    <Button 
                      size="icon"
                      variant="ghost"
                      disabled={processingDelete === notification.id}
                      onClick={() => deleteNotification(notification.id)}
                      className="w-8 h-8 sm:w-9 sm:h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer border border-transparent transition-all"
                      title="Delete"
                    >
                      {processingDelete === notification.id ? (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 bg-muted/10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-2xl sm:rounded-3xl border border-border flex items-center justify-center mb-6">
                <HugeiconsIcon icon={Notification01Icon} className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40" />
              </div>
              <h2 className="text-xl sm:text-2xl font-one font-bold mb-2 text-foreground">
                {searchQuery || filter !== "all" ? "No matches found" : "All caught up!"}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-xs px-6">
                {searchQuery || filter !== "all" 
                  ? "Try adjusting your search or filters to find what you're looking for." 
                  : "No new notifications at the moment. We'll alert you when something important happens."}
              </p>
              {(searchQuery || filter !== "all") && (
                <Button 
                  onClick={() => {setSearchQuery(""); setFilter("all");}}
                  variant="link" 
                  className="text-primary mt-4 h-auto p-0 cursor-pointer text-xs"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 md:mt-12">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border overflow-hidden">
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 hover:bg-background rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-10 flex items-center justify-center font-bold text-lg"
              >
                «
              </button>
              <div className="px-4 sm:px-6 py-2 bg-background text-foreground rounded-lg shadow-sm h-10 flex items-center justify-center font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 hover:bg-background rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-10 flex items-center justify-center font-bold text-lg"
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
