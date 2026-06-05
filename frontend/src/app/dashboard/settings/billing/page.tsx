"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { api } from "@/lib/api";
import { ShamCashModal } from "@/components/dashboard/ShamCashModal";

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    period: { monthly: "forever", annual: "forever" },
    features: [
      "Public portfolio page",
      "1 theme",
      "Up to 3 projects",
      "6 gallery photos",
      "Basic analytics",
      "PortfolioCraft subdomain",
      "Telegram notifications",
    ],
    cta: "Current Plan",
    level: 0,
  },
  {
    id: "PRO",
    name: "Pro",
    price: { monthly: "$5", annual: "$48" },
    period: { monthly: "per month", annual: "per year" },
    features: [
      "Everything in Free",
      "6 premium themes",
      "Unlimited projects",
      "30 gallery photos",
      "5 services listings",
      "Blog system",
      "Custom domain",
      "Advanced analytics",
      "Email & Telegram notifications",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    level: 1,
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: { monthly: "$12", annual: "$99" },
    period: { monthly: "per month", annual: "per year" },
    features: [
      "Everything in Pro",
      "All 12 themes",
      "Unlimited gallery",
      "Unlimited services",
      "Clients showcase",
      "Achievements section",
      "Booking system",
      "PDF CV export",
      "Business cards ordering",
    ],
    cta: "Upgrade to Business",
    level: 2,
  },
];

export default function BillingPage() {
  const ready = usePortfolioGuard();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [shamCashPlan, setShamCashPlan] = useState<"PRO" | "BUSINESS" | null>(
    null,
  );
  const [userCountry, setUserCountry] = useState<string>("");
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paypal") === "success") {
      const orderId = params.get("token");
      const plan = params.get("plan");
      if (orderId) capturePaypal(orderId);
    }
    if (params.get("paypal") === "cancelled") {
      toast.error("PayPal payment cancelled");
    }
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated! 🎉");
    }
    if (searchParams.get("cancelled") === "true") {
      toast.error("Checkout cancelled");
    }

    // fetch("http://localhost:3001/v1/billing/subscription", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // })
    api
      .get("/billing/subscription")
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data);
        setLoading(false);
      });

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => setUserCountry(data.country_code ?? ""))
      .catch(() => {});
  }, []);
  const isSyria = userCountry === "SY";

  async function capturePaypal(orderId: string) {
    try {
      const res = await api.post("/billing/paypal/capture", { orderId });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment successful! 🎉");
        window.location.href = "/dashboard/settings/billing";
      }
    } catch {
      toast.error("Payment verification failed");
    }
  }

  async function handlePaypalUpgrade(planId: string) {
    setCheckoutLoading(`paypal-${planId}`);
    try {
      const res = await api.post("/billing/paypal/create", {
        plan: planId,
        interval: interval, // ← أضف
      });
      const data = await res.json();
      if (data.approvalUrl) window.location.href = data.approvalUrl;
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleUpgrade(planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await api.post("/billing/checkout", {
        plan: planId,
        interval: interval,
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleManage() {
    try {
      // const res = await fetch("http://localhost:3001/v1/billing/portal", {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      const res = await api.post("/billing/portal");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Something went wrong");
    }
  }
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  const currentPlan = subscription?.plan ?? "FREE";
  const currentPlanData = plans.find((p) => p.id === currentPlan);
  const shamBtn = (id: any) => {
    if (isSyria) {
      setShamCashPlan(id as "PRO" | "BUSINESS");
    } else {
      toast.info("ShamCash is available for users in Syria only");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Billing
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription</p>
      </div>
      {subscription?.daysUntilEnd && subscription.daysUntilEnd <= 7 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-700 font-medium">
            ⚠️ Your subscription expires in {subscription.daysUntilEnd} days
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Renew now to keep your custom domain, themes, and all features
            active.
          </p>
        </div>
      )}
      {currentPlan === "FREE" && subscription?.hadPaidPlan && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-600 font-medium">
            ⚠️ Your subscription has ended
          </p>
          <p className="text-xs text-red-400 mt-1">
            Your portfolio is now limited to Free plan features. Your data is
            safe — upgrade to restore full access.
          </p>
        </div>
      )}
      {/* Current Plan Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Current Plan
          </p>
          <p className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mt-0.5">
            {currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase()}
          </p>
        </div>
        {currentPlan !== "FREE" && subscription?.stripeSubscriptionId && (
          <button
            onClick={handleManage}
            className="border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
          >
            Manage Subscription
          </button>
        )}
        {currentPlan !== "FREE" && !subscription?.stripeSubscriptionId && (
          <a
            href={`https://wa.me/963968767511?text=${encodeURIComponent("Hi! I want to manage my subscription on PortfolioCraft.")}`}
            target="_blank"
            className="border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition"
          >
            💬 Contact to Manage
          </a>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setInterval("monthly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            interval === "monthly"
              ? "bg-indigo-600 text-white"
              : "border border-gray-200 text-gray-600"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval("annual")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            interval === "annual"
              ? "bg-indigo-600 text-white"
              : "border border-gray-200 text-gray-600"
          }`}
        >
          Annual
          <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
          .map((plan) => {
            // const isCurrent = currentPlan === plan.id;

            const isCurrent = currentPlan === plan.id;
            const isUpgrade = plan.level > (currentPlanData?.level ?? 0);
            const isDowngrade = plan.level < (currentPlanData?.level ?? 0);
            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-gray-900 rounded-xl border p-6 relative ${
                  isCurrent
                    ? "border-indigo-500 dark:border-indigo-600 shadow-md"
                    : plan.highlighted
                      ? "border-indigo-300 dark:border-indigo-700 shadow-sm"
                      : "border-gray-100 dark:border-gray-800"
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-4 right-4 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
                {/* {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )} */}
                {plan.highlighted && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-2 mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price[interval]}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    {plan.period[interval]}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-indigo-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* <button
                  onClick={() =>
                    !isCurrent &&
                    // !plan.disabled &&
                    plan.id !== "FREE" &&
                    handleUpgrade(plan.id)
                  }
                  disabled={
                    isCurrent ||
                    //  || plan.disabled
                    checkoutLoading === plan.id ||
                    plan.id === "FREE"
                  }
                  // className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
                  //   isCurrent
                  //     ? // ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default"
                  //       "bg-indigo-50 border-indigo-300 text-indigo-700"
                  //     : plan.highlighted
                  //       ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  //       : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"

                  //     } disabled:opacity-50
                  // `}
                  className={`w-full py-2.5 cursor-pointer rounded-lg text-sm font-medium transition ${
                    isCurrent
                      ? "bg-indigo-50 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 cursor-not-allowed"
                      : plan.highlighted
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : isUpgrade
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    //  "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } disabled:opacity-50`}
                >
                  {checkoutLoading === plan.id
                    ? "Loading..."
                    : isCurrent
                      ? "Current Plan"
                      : plan.id === "FREE"
                        ? "Downgrade to Free"
                        : isUpgrade
                          ? `Upgrade to ${plan.name}`
                          : `Switch to ${plan.name}`}
                </button> */}
                <button
  onClick={() =>
    !isCurrent &&
    plan.id !== "FREE" &&
    isUpgrade &&  // ← أضف هذا
    handleUpgrade(plan.id)
  }
  disabled={
    isCurrent ||
    checkoutLoading === plan.id ||
    plan.id === "FREE" ||
    isDowngrade  // ← أضف هذا
  }
  className={`w-full py-2.5 cursor-pointer rounded-lg text-sm font-medium transition ${
    isCurrent
      ? "bg-indigo-50 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 cursor-not-allowed"
      : isDowngrade
        ? "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : plan.highlighted
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : isUpgrade
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
  } disabled:opacity-50`}
>
  {checkoutLoading === plan.id
    ? "Loading..."
    : isCurrent
      ? "Current Plan"
      : isDowngrade
        ? "Current plan is higher"
        : plan.id === "FREE"
          ? "Free Plan"
          : `Upgrade to ${plan.name}`}
</button>
                {!isCurrent && plan.id !== "FREE" && !isDowngrade && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 text-center mb-2">
                      or pay with
                    </p>
                    <button
                      onClick={() => handlePaypalUpgrade(plan.id)}
                      disabled={checkoutLoading === `paypal-${plan.id}`}
                      className="w-full py-2 cursor-pointer rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] transition disabled:opacity-50"
                    >
                      {checkoutLoading === `paypal-${plan.id}`
                        ? "Loading..."
                        : "🅿 PayPal"}
                    </button>
                  </div>
                )}

                {!isCurrent && plan.id !== "FREE" && !isDowngrade &&  (
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        // setShamCashPlan(plan.id as "PRO" | "BUSINESS")
                        shamBtn(plan.id as "PRO" | "BUSINESS")
                      }
                      // disabled={!isSyria}
                      className="w-full cursor-pointer py-2 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-400 hover:text-white transition"
                    >
                      {isSyria ? (
                        "⭐ Pay with ShamCash"
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg width="20" height="14" viewBox="0 0 30 20">
                            <rect
                              width="30"
                              height="6.6"
                              y="0"
                              fill="#007a3d"
                            />
                            <rect
                              width="30"
                              height="6.6"
                              y="6.7"
                              fill="#ffffff"
                            />
                            <rect
                              width="30"
                              height="6.6"
                              y="13.4"
                              fill="#000000"
                            />
                            <text
                              x="15"
                              y="12"
                              textAnchor="middle"
                              fontSize="5"
                              fill="#ce1126"
                            >
                              ★ ★ ★
                            </text>
                          </svg>
                          Pay with ShamCash
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {shamCashPlan && (
        <ShamCashModal
          plan={shamCashPlan}
          onClose={() => setShamCashPlan(null)}
        />
      )}
    </div>
  );
}
