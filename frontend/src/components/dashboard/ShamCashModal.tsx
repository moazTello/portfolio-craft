"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Props {
  plan: "PRO" | "BUSINESS";
  onClose: () => void;
}

const PRICES = { PRO: "$9", BUSINESS: "$19" };
const WHATSAPP = "963968767511";

export function ShamCashModal({ plan, onClose }: Props) {
  const [step, setStep] = useState<"qr" | "sent">("qr");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRequest() {
    if (!name || !phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    setLoading(true);
    try {
      await api.post("/billing/manual-request", {
        plan,
        name,
        phone,
        note,
        method: "shamcash",
      });
      setStep("sent");
    } catch {
      toast.error("Something went wrong. Please contact us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-green-500 px-6 py-4 flex items-center justify-between rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">ShamCash Payment</h2>
            <p className="text-green-100 text-sm">
              {plan} Plan — {PRICES[plan]}/month
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 rounded-b-2xl">
          {step === "qr" ? (
            <div className="p-6">
              {/* Steps */}
              <div className="flex items-center gap-2 mb-6">
                {["Scan & Pay", "Fill Info", "Done"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs ${i === 0 ? "text-green-600 font-medium" : "text-gray-400"}`}
                    >
                      {s}
                    </span>
                    {i < 2 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center mb-4">
                <p className="text-xs text-gray-500 mb-3">
                  Scan with ShamCash app
                </p>
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl mx-auto flex items-center justify-center">
                  <img
                    src="/shamcash-qr.png"
                    alt="ShamCash QR"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const next = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (next) next.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden text-center p-4">
                    <p className="text-4xl mb-2">📱</p>
                    <p className="text-xs text-gray-400">
                      Add QR image to
                      <br />
                      /public/shamcash-qr.png
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-green-50 dark:bg-green-950 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">
                    {PRICES[plan]} USD
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    PortfolioCraft — {plan} Plan
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mohammed Tello"
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+963 9XX XXX XXX"
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Transaction Note (optional)
                  </label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Transaction ID or note"
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  ⏱ Your account will be activated within{" "}
                  <strong>24 hours</strong> after payment confirmation.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={submitRequest}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 mb-3"
              >
                {loading ? "Sending..." : "✓ I've sent the payment"}
              </button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I want to upgrade to ${plan} plan on PortfolioCraft. Amount: ${PRICES[plan]}/month`)}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 dark:hover:bg-green-950 transition mb-3"
              >
                <span className="text-lg">💬</span>
                In a hurry? Contact us on WhatsApp
              </a>

              {/* Cancel */}
              <button
                onClick={onClose}
                className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition py-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Success */
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Request Received!
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                We'll verify your payment and activate your{" "}
                <strong>{plan}</strong> plan within <strong>24 hours</strong>.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-2">
                  Your request details:
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {name}
                </p>
                <p className="text-sm text-gray-500">{phone}</p>
                <p className="text-sm text-green-600 font-medium">
                  {plan} — {PRICES[plan]}/mo
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I just submitted a payment request for ${plan} plan. Name: ${name}, Phone: ${phone}`)}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition mb-3"
              >
                <span>💬</span> Follow up on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
