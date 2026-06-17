import { getUser } from "@/lib/getUser";
import Navbar from "./components/navbar";
import PricingSection from "./components/PricingSection";
import TotalData from "./components/totalData";
import Features from "./components/features";
import FaqSection from "./components/faqSection";
import Footer from "./components/footer";
import LiveOn from "./components/liveOn";
import ShortenerForm from "./components/ShortenerForm";

export default async function Dashboard() {
  const user = await getUser();
  const isLoggedIn = !!user;
  const userPlan = user?.plan || "FREE";

  return (
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300 overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">

          <div className="flex-1 text-center lg:text-left lg:pt-6">
            <h1 className="text-3xl sm:text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight font-three tracking-tight">
              <span className="text-red-500">Url Shortner,</span><br />
              QR Generator,<br />
              Custom Domain,<br />
              Detailed Analytics.
            </h1>

            <p className="font-one text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-4 px-2 sm:px-0">
              Fasturl is your all-in-one link management platform for digital marketing links, and real time click tracking.
            </p>

          </div>

          <div className="flex-1 w-full max-w-xl">
            <ShortenerForm />
          </div>

        </div>
      </section>

      <Features isLoggedIn={isLoggedIn} userPlan={userPlan} />
      <div className="w-full h-px bg-border my-12 shadow-sm"></div>

      <div id="pricing-section">
        {userPlan !== "ESSENTIAL" && userPlan !== "PRO" && <PricingSection />}
      </div>
      <FaqSection />

      <TotalData />
      <LiveOn />
      <Footer />
    </div>
  );
}
