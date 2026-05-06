"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
interface Props {
  username: string;
}

export function BookingWidget({ username }: Props) {
  const [step, setStep] = useState<"date" | "slot" | "info" | "done">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState(60);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  async function fetchSlots(date: string) {
    setLoadingSlots(true);
    try {
      // const res = await fetch(
      //   `http://localhost:3001/v1/public/booking/${username}/slots?date=${date}`,
      // );
      const res = await api.get(
        `/public/booking/${username}/slots?date=${date}`,
      );
      const data = await res.json();
      setSlots(data.slots ?? []);
      setDuration(data.duration ?? 60);
      setStep("slot");
    } catch {
      toast.error("Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function submitBooking() {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      // const res = await fetch(
      //   `http://localhost:3001/v1/public/booking/${username}`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       clientName: name,
      //       clientEmail: email,
      //       clientPhone: phone || undefined,
      //       date: selectedDate,
      //       time: selectedSlot,
      //       notes: notes || undefined,
      //     }),
      //   },
      // );
      const res = await api.post(`/public/booking/${username}`, {
        clientName: name,
        clientEmail: email,
        clientPhone: phone || undefined,
        date: selectedDate,
        time: selectedSlot,
        notes: notes || undefined,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--p-card-bg)",
        border: "1px solid var(--p-card-border)",
      }}
      className="rounded-2xl p-6 max-w-md mx-auto"
    >
      {step === "date" && (
        <div>
          <h3
            style={{ color: "var(--p-text)" }}
            className="font-semibold text-lg mb-4"
          >
            📅 Book an Appointment
          </h3>
          <label
            style={{ color: "var(--p-text-muted)" }}
            className="block text-sm mb-2"
          >
            Select a date
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />
          <button
            onClick={() => selectedDate && fetchSlots(selectedDate)}
            disabled={!selectedDate || loadingSlots}
            style={{
              background: "var(--p-btn-bg)",
              color: "var(--p-btn-text)",
            }}
            className="w-full py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loadingSlots ? "Loading..." : "See Available Times →"}
          </button>
        </div>
      )}

      {step === "slot" && (
        <div>
          <button
            onClick={() => setStep("date")}
            style={{ color: "var(--p-text-muted)" }}
            className="text-sm mb-4 block"
          >
            ← Back
          </button>
          <h3 style={{ color: "var(--p-text)" }} className="font-semibold mb-1">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <p style={{ color: "var(--p-text-muted)" }} className="text-xs mb-4">
            {duration} min appointments
          </p>

          {slots.length === 0 ? (
            <p
              style={{ color: "var(--p-text-muted)" }}
              className="text-sm text-center py-4"
            >
              No available slots for this date
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep("info");
                  }}
                  style={{
                    border: `1px solid var(--p-border)`,
                    color: "var(--p-text)",
                    background:
                      selectedSlot === slot
                        ? "var(--p-primary)"
                        : "transparent",
                  }}
                  className="py-2 rounded-lg text-sm hover:opacity-80 transition"
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "info" && (
        <div>
          <button
            onClick={() => setStep("slot")}
            style={{ color: "var(--p-text-muted)" }}
            className="text-sm mb-4 block"
          >
            ← Back
          </button>
          <h3 style={{ color: "var(--p-text)" }} className="font-semibold mb-4">
            📝 Your Details
          </h3>
          <div className="space-y-3 mb-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name *"
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address *"
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Summary */}
          <div
            style={{
              background: "var(--p-surface)",
              border: "1px solid var(--p-border)",
            }}
            className="rounded-lg p-3 mb-4 text-xs"
          >
            <p style={{ color: "var(--p-text)" }} className="font-medium mb-1">
              Appointment Summary
            </p>
            <p style={{ color: "var(--p-text-muted)" }}>
              📅{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p style={{ color: "var(--p-text-muted)" }}>
              🕐 {selectedSlot} · {duration} minutes
            </p>
          </div>

          <button
            onClick={submitBooking}
            disabled={submitting}
            style={{
              background: "var(--p-btn-bg)",
              color: "var(--p-btn-text)",
            }}
            className="w-full py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm Booking →"}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <h3
            style={{ color: "var(--p-text)" }}
            className="font-semibold text-lg mb-2"
          >
            Booking Confirmed!
          </h3>
          <p style={{ color: "var(--p-text-muted)" }} className="text-sm mb-1">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedSlot}
          </p>
          <p style={{ color: "var(--p-text-muted)" }} className="text-xs">
            You'll receive a confirmation email shortly.
          </p>
          <button
            onClick={() => {
              setStep("date");
              setSelectedDate("");
              setSelectedSlot("");
            }}
            style={{ color: "var(--p-primary)" }}
            className="text-sm mt-4 hover:underline"
          >
            Book another appointment
          </button>
        </div>
      )}
    </div>
  );
}
