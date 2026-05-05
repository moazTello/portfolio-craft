"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CONFIRMED:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400",
  COMPLETED: "bg-gray-100 text-gray-500 dark:bg-gray-800",
};

const DEFAULT_AVAILABILITY = DAYS.map((_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "17:00",
  isActive: i >= 1 && i <= 5, // Mon-Fri
}));

export default function BookingPage() {
  const ready = usePortfolioGuard();
  const [tab, setTab] = useState<"bookings" | "settings">("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [duration, setDuration] = useState(60);
  const [buffer, setBuffer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userPlan, setUserPlan] = useState("FREE");

  useEffect(() => {
    if (!ready) return;
    fetchAll();
  }, [ready]);

  async function fetchAll() {
    try {
      const [bookingsRes, availRes, portfolioRes, meRes] = await Promise.all([
        api.get("/booking/bookings").then((r) => r.json()),
        api.get("/booking/availability").then((r) => r.json()),
        api.get("/portfolios/mine").then((r) => r.json()),
        api.get("/auth/me").then((r) => r.json()),
      ]);

      setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
      setBookingEnabled(portfolioRes.bookingEnabled ?? false);
      setDuration(portfolioRes.bookingDuration ?? 60);
      setBuffer(portfolioRes.bookingBuffer ?? 0);
      setUserPlan(meRes.plan ?? "FREE");

      if (Array.isArray(availRes) && availRes.length > 0) {
        const merged = DEFAULT_AVAILABILITY.map((def) => {
          const found = availRes.find(
            (a: any) => a.dayOfWeek === def.dayOfWeek,
          );
          return found ?? def;
        });
        setAvailability(merged);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBooking() {
    try {
      await api.patch("/booking/toggle", { enabled: !bookingEnabled });
      setBookingEnabled(!bookingEnabled);
      toast.success(bookingEnabled ? "Booking disabled" : "Booking enabled!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      await Promise.all([
        api.post("/booking/availability", { slots: availability }),
        api.patch("/booking/settings", {
          bookingDuration: duration,
          bookingBuffer: buffer,
        }),
      ]);
      toast.success("Settings saved!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/booking/bookings/${id}/status`, { status });
      toast.success("Status updated!");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.delete(`/booking/bookings/${id}`);
      toast.success("Booking deleted");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function updateSlot(dayOfWeek: number, field: string, value: any) {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot,
      ),
    );
  }

  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  if (!ready || loading) return <LoadingSkeleton rows={4} />;
  if (userPlan !== "BUSINESS") {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Booking System is a Business Feature
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Upgrade to Business plan to enable appointment booking on your
          portfolio.
        </p>
        <a
          href="/dashboard/settings/billing"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Upgrade to Business →
        </a>
      </div>
    );
  }
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Booking
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage appointments and availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Booking</span>
          <button
            onClick={toggleBooking}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              bookingEnabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                bookingEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${bookingEnabled ? "text-indigo-600" : "text-gray-400"}`}
          >
            {bookingEnabled ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
        {(["bookings", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              tab === t
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t}
            {t === "bookings" &&
              bookings.filter((b) => b.status === "PENDING").length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {bookings.filter((b) => b.status === "PENDING").length}
                </span>
              )}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div>
          {/* Status Filter */}
          <div className="flex gap-2 mb-4">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    statusFilter === s
                      ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950 text-indigo-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {s}
                  {s !== "ALL" && (
                    <span className="ml-1 text-gray-400">
                      ({bookings.filter((b) => b.status === s).length})
                    </span>
                  )}
                </button>
              ),
            )}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
              <p className="text-4xl mb-4">📅</p>
              <p className="text-gray-400 text-sm">No bookings yet</p>
              {!bookingEnabled && (
                <p className="text-xs text-amber-500 mt-2">
                  Enable booking to start receiving appointments
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.clientName}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                        <span>📧 {booking.clientEmail}</span>
                        {booking.clientPhone && (
                          <span>📞 {booking.clientPhone}</span>
                        )}
                        <span>
                          📅{" "}
                          {new Date(booking.bookedAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span>
                          🕐{" "}
                          {new Date(booking.bookedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}{" "}
                          · {booking.durationMinutes}min
                        </span>
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-gray-400 mt-2 italic">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {booking.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(booking.id, "CONFIRMED")
                            }
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(booking.id, "CANCELLED")
                            }
                            className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => updateStatus(booking.id, "COMPLETED")}
                          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === "settings" && (
        <div className="space-y-6">
          {/* Duration & Buffer */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Appointment Settings
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buffer between appointments
                </label>
                <select
                  value={buffer}
                  onChange={(e) => setBuffer(Number(e.target.value))}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[0, 5, 10, 15, 30].map((b) => (
                    <option key={b} value={b}>
                      {b === 0 ? "No buffer" : `${b} minutes`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Weekly Availability
            </h2>
            <div className="space-y-3">
              {availability.map((slot) => (
                <div key={slot.dayOfWeek} className="flex items-center gap-4">
                  {/* Toggle */}
                  <button
                    onClick={() =>
                      updateSlot(slot.dayOfWeek, "isActive", !slot.isActive)
                    }
                    className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                      slot.isActive
                        ? "bg-indigo-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        slot.isActive ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {/* Day */}
                  <span
                    className={`text-sm w-24 ${slot.isActive ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}
                  >
                    {DAYS[slot.dayOfWeek]}
                  </span>

                  {/* Times */}
                  {slot.isActive ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(
                            slot.dayOfWeek,
                            "startTime",
                            e.target.value,
                          )
                        }
                        className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-gray-400 text-sm">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(slot.dayOfWeek, "endTime", e.target.value)
                        }
                        className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
