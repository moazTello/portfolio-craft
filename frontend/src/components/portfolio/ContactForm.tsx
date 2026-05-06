"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
const schema = z.object({
  senderName: z.string().min(2, "Name is required"),
  senderEmail: z.string().email("Invalid email"),
  subject: z.string().optional(),
  content: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm({ portfolioId }: { portfolioId: string }) {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    try {
      // const res = await fetch("http://localhost:3001/v1/messages/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...values, portfolioId }),
      // });
      const res = await api.post("/messages/send", { ...values, portfolioId });

      if (!res.ok) throw new Error();
      setSent(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-xl p-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
          Message sent!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-400">
          I'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-xs text-green-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            {...register("senderName")}
            placeholder="Your name"
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.senderName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.senderName.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("senderEmail")}
            type="email"
            placeholder="your@email.com"
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.senderEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.senderEmail.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <input
          {...register("subject")}
          placeholder="Subject (optional)"
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <textarea
          {...register("content")}
          placeholder="Your message..."
          rows={4}
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
