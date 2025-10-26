// Define plans outside the component to prevent re-creation on each render
export const PLANS = {
  annually: {
    id: "annually" as const,
    name: "Pay annually",
    price: 10,
    priceText: "$10 / month / member",
  },
  monthly: {
    id: "monthly" as const,
    name: "Pay monthly",
    price: 12,
    priceText: "$12 / month / member",
  },
};

export type PlanId = keyof typeof PLANS;
