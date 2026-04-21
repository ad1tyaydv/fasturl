import DodoPayments from "dodopayments";

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

export function getProductIdForPlan(plan: "ESSENTIAL" | "PRO") {
  const map: Record<"ESSENTIAL" | "PRO", string | undefined> = {
    ESSENTIAL: process.env.DODO_PRODUCT_ESSENTIALS_ID,
    PRO: process.env.DODO_PRODUCT_PRO_ID,
  };

  const id = map[plan];

  if(!id) {
    throw new Error(`Missing product id for plan ${plan}. Set DODO_PRODUCT_ESSENTIALS_ID and DODO_PRODUCT_PRO_ID`);
  }
  return id;
}

export function resolvePlanByProductId(productId: string): "ESSENTIAL" | "PRO" | null {
  const essentials = process.env.DODO_PRODUCT_ESSENTIALS_ID;
  const pro = process.env.DODO_PRODUCT_PRO_ID;
  if (essentials && productId === essentials) return "ESSENTIAL";
  if (pro && productId === pro) return "PRO";
  return null;
}