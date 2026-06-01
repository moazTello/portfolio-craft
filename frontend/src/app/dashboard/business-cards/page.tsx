"use client";

import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { ShamCashModal } from "@/components/dashboard/ShamCashModal";

const DESIGNS = [
  {
    id: "classic",
    name: "Classic",
    desc: "أبيض نظيف",
    bg: "#ffffff",
    accent: "#4F46E5",
    text: "#0f0f0f",
    border: "1px solid #e5e5e5",
  },
  {
    id: "dark",
    name: "Dark Pro",
    desc: "داكن احترافي",
    bg: "#0f172a",
    accent: "#7C3AED",
    text: "#f1f5f9",
    border: "none",
  },
  {
    id: "luxury",
    name: "Luxury Gold",
    desc: "ذهبي فخم",
    bg: "#1a1200",
    accent: "#D4AF37",
    text: "#f5e6b8",
    border: "none",
  },
  {
    id: "rose",
    name: "Rose",
    desc: "وردي زاهي",
    bg: "#fff5f8",
    accent: "#e91e8c",
    text: "#880e4f",
    border: "1px solid #fce4ec",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    desc: "رمادي غامق فخم",
    bg: "#1c1c1e",
    accent: "#888888",
    text: "#f5f5f5",
    border: "none",
  },
  {
    id: "ink",
    name: "Ink Blue",
    desc: "أزرق حبري",
    bg: "#0d1b3e",
    accent: "#4f7ce8",
    text: "#e8eeff",
    border: "none",
  },
];

const QUANTITIES = [
  { value: 500, label: "500 cards", price: "$45" },
  { value: 1000, label: "1000 cards", price: "$75" },
];

export default function BusinessCardsPage() {
  const ready = usePortfolioGuard();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState("classic");
  const [selectedQty, setSelectedQty] = useState(500);
  const [userPlan, setUserPlan] = useState("FREE");
  const [showOrder, setShowOrder] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    Promise.all([
      api.get("/auth/me").then((r) => r.json()),
      api.get("/portfolios/mine").then((r) => r.json()),
    ]).then(([me, port]) => {
      setUserPlan(me.plan ?? "FREE");
      setPortfolio(port);
      setName(port.heroTitle ?? "");
      setPhone(port.phone ?? "");
      setLoading(false);
    });
  }, [ready]);

  const design = DESIGNS.find((d) => d.id === selectedDesign)!;
  const qty = QUANTITIES.find((q) => q.value === selectedQty)!;

  async function handleOrder() {
    if (!name || !phone || !address) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const message = `
🎴 <b>New Business Card Order!</b>

👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> ${phone}
📍 <b>Address:</b> ${address}
🎨 <b>Design:</b> ${design.name}
📦 <b>Quantity:</b> ${selectedQty} cards
💰 <b>Price:</b> ${qty.price}
🌐 <b>Portfolio:</b> portfoliocraft.com/${portfolio?.username}
📝 <b>Notes:</b> ${notes || "—"}
      `.trim();

      await fetch(
        `https://portfolio-craft-production.up.railway.app/v1/messages/notify-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        },
      ).catch(() => {});

      toast.success("Order submitted! We will contact you soon via WhatsApp.");
      setShowOrder(false);
      setNotes("");
      setAddress("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready || loading) return <LoadingSkeleton rows={4} />;

  if (userPlan === "FREE") {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
        <p className="text-4xl mb-4">🎴</p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Business Cards — Pro & Business
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Order professional business cards with your portfolio QR code
        </p>
        <a
          href="/dashboard/settings/billing"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Upgrade Now →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Business Cards
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Order professional cards with your portfolio QR code
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Design Picker */}
        <div className="space-y-6">
          {/* Design Selection */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Choose Design
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesign(d.id)}
                  className={`relative rounded-xl overflow-hidden border-2 transition ${
                    selectedDesign === d.id
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                >
                  {/* Mini Card Preview */}
                  <div
                    className="h-20 flex items-center justify-center"
                    style={{ background: d.bg, border: d.border }}
                  >
                    <div className="text-center">
                      <div
                        style={{
                          color: d.text,
                          fontSize: "11px",
                          fontWeight: "500",
                        }}
                      >
                        {d.name}
                      </div>
                      <div
                        style={{
                          color: d.accent,
                          fontSize: "9px",
                          marginTop: "2px",
                        }}
                      >
                        {d.desc}
                      </div>
                      {/* Mini QR */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: `1.5px solid ${d.accent}`,
                          margin: "4px auto 0",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          padding: "2px",
                          gap: "1px",
                        }}
                      >
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              background: [0, 2, 6, 8, 4].includes(i)
                                ? d.accent
                                : "transparent",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedDesign === d.id && (
                    <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Quantity
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUANTITIES.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setSelectedQty(q.value)}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    selectedQty === q.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {q.price}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{q.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Preview + Order */}
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <div
              className="rounded-xl p-6 relative overflow-hidden"
              style={{
                background: design.bg,
                border: design.border,
                minHeight: "160px",
              }}
            >
              {/* Accent line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: design.accent,
                }}
              />

              <div style={{ paddingLeft: "16px" }}>
                <div
                  style={{
                    color: design.text,
                    fontSize: "18px",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  {name || portfolio?.heroTitle || "Your Name"}
                </div>
                <div
                  style={{
                    color: design.accent,
                    fontSize: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {portfolio?.heroSubtitle || "Your Title"}
                </div>
                <div
                  style={{
                    color: design.accent,
                    opacity: 0.6,
                    fontSize: "11px",
                    lineHeight: "1.8",
                  }}
                >
                  <div>{portfolio?.email || "email@example.com"}</div>
                  <div>{portfolio?.phone || "+XXX XXX XXX"}</div>
                  <div>{portfolio?.location || "Your City"}</div>
                </div>
              </div>

              {/* QR hint */}
              <div
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: `2px solid ${design.accent}`,
                  padding: "8px",
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: design.accent,
                    textAlign: "center",
                    marginBottom: "4px",
                  }}
                >
                  QR
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "2px",
                  }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: [0, 2, 6, 8, 4].includes(i)
                          ? design.accent
                          : "transparent",
                        border: `0.5px solid ${design.accent}`,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "20px",
                  fontSize: "9px",
                  color: design.accent,
                  opacity: 0.3,
                }}
              >
                portfoliocraft.com/{portfolio?.username}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Design</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {design.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {selectedQty} cards
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <span className="text-gray-900 dark:text-white font-semibold">
                  Total
                </span>
                <span className="text-indigo-600 font-bold text-lg">
                  {qty.price}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowOrder(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
            >
              Order Now — Pay with ShamCash
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              We'll contact you via WhatsApp to confirm delivery
            </p>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Complete Your Order
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              {design.name} · {selectedQty} cards · {qty.price}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+963 XXX XXX XXX"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Address *
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, Area, Street"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any special requests..."
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* ShamCash Info */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                Payment via ShamCash
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                After submitting, we'll send you the ShamCash payment details
                via WhatsApp. Your order will be confirmed after payment.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrder(false)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
