import DodoPayments from "dodopayments";

type Plan = "ESSENTIAL" | "PRO";
type BillingCycle = "MONTHLY" | "ANNUALLY";

type DodoEnv = "test_mode" | "live_mode";

export function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not set");
  }

  const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as DodoEnv | undefined) ?? "test_mode";

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

export function getProductIdForPlan(plan: Plan, cycle: BillingCycle) {
  const map: Record<Plan, Record<BillingCycle, string | undefined>> = {
    ESSENTIAL: {
      MONTHLY: process.env.DODO_PRODUCT_ESSENTIALS_ID_MONTHLY,
      ANNUALLY: process.env.DODO_PRODUCT_ESSENTIALS_ID_ANNUALLY,
    },
    PRO: {
      MONTHLY: process.env.DODO_PRODUCT_PRO_ID_MONTHLY,
      ANNUALLY: process.env.DODO_PRODUCT_PRO_ID_ANNUALLY,
    },
  };

  const id = map[plan][cycle];

  if (!id) {
    throw new Error(`Missing product id for ${plan} (${cycle})`);
  }

  return id;
}

export function resolvePlanByProductId(productId: string): {
  plan: Plan;
  cycle: BillingCycle;
} | null {
  const mapping = [
    {
      productId: process.env.DODO_PRODUCT_ESSENTIALS_ID_MONTHLY,
      plan: "ESSENTIAL",
      cycle: "MONTHLY",
    },
    {
      productId: process.env.DODO_PRODUCT_ESSENTIALS_ID_ANNUALLY,
      plan: "ESSENTIAL",
      cycle: "ANNUALLY",
    },
    {
      productId: process.env.DODO_PRODUCT_PRO_ID_MONTHLY,
      plan: "PRO",
      cycle: "MONTHLY",
    },
    {
      productId: process.env.DODO_PRODUCT_PRO_ID_ANNUALLY,
      plan: "PRO",
      cycle: "ANNUALLY",
    },
  ];

  const found = mapping.find((item) => item.productId === productId);

  if (!found) return null;

  return {
    plan: found.plan as Plan,
    cycle: found.cycle as BillingCycle,
  };
}