"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/components/userContext";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function UpgradeDiscount() {
    const { user, loading } = useUser();
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const isFreeTier = !user || user.plan === "FREE";
        if (!isFreeTier) return;

        const lastShown = localStorage.getItem("upgrade_discount_last_shown");
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (!lastShown || now - parseInt(lastShown) > twentyFourHours) {
            setOpen(true);
            localStorage.setItem("upgrade_discount_last_shown", now.toString());
        }
    }, [user, loading]);

    const handleUpgrade = () => {
        setOpen(false);
        if (user) {
            router.push("/premium");

        } else {
            router.push("/auth/signin");
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText("FAST90");
        setCopied(true);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[400px] border-none p-0 overflow-hidden bg-background shadow-2xl rounded-3xl [&>button]:cursor-pointer [&>button_svg]:w-7 [&>button_svg]:h-7 [&>button]:right-5 [&>button]:top-5">
                <div className="relative p-8 space-y-6">
                    <DialogHeader className="space-y-4 relative z-10">
                        <div className="space-y-1">
                            <DialogTitle className="text-3xl font-extrabold tracking-tight">
                                Special Upgrade Offer!
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                                Unlock the full potential of FastURL.<br />
                                <span className="text-foreground text-lg font-normal">
                                    Get <span className="font-bold text-amber-600 dark:text-amber-500">90%</span> OFF on all <span className="font-bold text-amber-600 dark:text-amber-500">yearly</span> plans!
                                </span>
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="bg-secondary/40 rounded-2xl p-4 border border-border/50 space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Coupon Code</span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                                Limited Time
                            </span>
                        </div>
                        <div className="flex items-center justify-between bg-background border border-border p-3 rounded-xl shadow-sm">
                            <code className="text-xl font-mono font-black text-primary tracking-wider">FAST90</code>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 font-bold hover:bg-primary/10 hover:text-primary rounded-lg transition-all cursor-pointer"
                                onClick={copyCode}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? "COPIED" : "COPY"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2 relative z-10">
                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none font-bold rounded-xl shadow-lg shadow-amber-500/20 h-12 cursor-pointer text-lg"
                        >
                            Claim 90% Discount
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="w-full text-muted-foreground hover:text-foreground font-medium rounded-xl h-11 cursor-pointer"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}