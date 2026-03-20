"use client";

import { useRouter } from "next/navigation";
import { 
  IoBarChartOutline, 
  IoLayersOutline, 
  IoQrCodeOutline, 
  IoListOutline, 
  IoArrowForwardOutline 
} from "react-icons/io5";

interface ShortlyFeaturesProps {
  isLoggedIn: boolean;
  userPlan: string;
}

export default function ShortlyFeatures({ isLoggedIn, userPlan }: ShortlyFeaturesProps) {
  const router = useRouter();

  const handleAccess = (path: string) => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }
    if (userPlan === "FREE") {
      router.push("/premium");
      return;
    }
    router.push(path);
  };

  const features = [
    {
      title: "Detailed Link Analytics",
      desc: "Track every click with geographic data and device info.",
      icon: <IoBarChartOutline size={28} />,
      path: "/analytics",
      color: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-200 dark:border-blue-900/30",
    },
    {
      title: "Bulk Short URLs",
      desc: "Shorten hundreds of links at once via CSV upload.",
      icon: <IoLayersOutline size={28} />,
      path: "/bulkLinks",
      color: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-200 dark:border-purple-900/30",
    },
    {
      title: "QR Code Generation",
      desc: "Create custom QR codes for every shortened link.",
      icon: <IoQrCodeOutline size={28} />,
      path: "/qr",
      color: "bg-emerald-600 hover:bg-emerald-700",
      border: "border-emerald-200 dark:border-emerald-900/30",
    },
    {
      title: "Link Management",
      desc: "Organize, edit, and delete your links in one dashboard.",
      icon: <IoListOutline size={28} />,
      path: "/urls",
      color: "bg-orange-600 hover:bg-orange-700",
      border: "border-orange-200 dark:border-orange-900/30",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background border-t border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-one font-bold mb-3 text-foreground">Shortly Plan Includes</h2>
          <p className="text-muted-foreground font-two">Premium tools to help you manage and track your brand's reach.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`bg-card border ${f.border} p-8 flex flex-col rounded-none shadow-sm transition-all hover:shadow-md`}>
              <div className="text-foreground mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-one font-bold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-two mb-8 flex-1 leading-relaxed">
                {f.desc}
              </p>
              <button
                onClick={() => handleAccess(f.path)}
                className={`w-full py-4 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97] rounded-none ${f.color}`}
              >
                Access Feature <IoArrowForwardOutline size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}