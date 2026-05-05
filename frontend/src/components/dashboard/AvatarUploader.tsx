"use client";

import { useState } from "react";
import { toast } from "sonner";

function getToken() {
  return localStorage.getItem("token") ?? "";
}

interface Props {
  currentAvatar?: string | null;
  name: string;
  onUpdate: (url: string) => void;
}

export function AvatarUploader({ currentAvatar, name, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  // async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //   // Check size — max 2MB
  //   // if (file.size > 2 * 1024 * 1024) {
  //   if (file.size > 102400) {
  //     toast.error('Image must be less than 90kB (.webp) prefered')
  //     return
  //   }
  //   setLoading(true)
  //   try {
  //     // Convert to base64
  //     const base64 = await new Promise<string>((resolve, reject) => {
  //       const reader = new FileReader()
  //       reader.onload = () => resolve(reader.result as string)
  //       reader.onerror = reject
  //       reader.readAsDataURL(file)
  //     })

  //     const res = await fetch('http://localhost:3001/v1/users/me/avatar', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //       body: JSON.stringify({ base64 }),
  //     })

  //     if (!res.ok) throw new Error()
  //     onUpdate(base64)
  //     toast.success('Avatar updated!')
  //   } catch {
  //     toast.error('Something went wrong')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  async function compressImage(
    file: File,
    maxWidth = 400,
    quality = 0.8,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // رسم الصورة على Canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل لـ base64 مع ضغط
        const base64 = canvas.toDataURL("image/jpeg", quality);

        URL.revokeObjectURL(url);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = url;
    });
  }
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size — max 5MB قبل الضغط
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setLoading(true);

    try {
      // ضغط الصورة قبل الرفع
      const originalSize = (file.size / 1024).toFixed(1);
      const base64 = await compressImage(file, 400, 0.8);
      const compressedSize = ((base64.length * 0.75) / 1024).toFixed(1);

      console.log(`Compressed: ${originalSize}KB → ${compressedSize}KB`);

      const res = await fetch("http://localhost:3001/v1/users/me/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ base64 }),
      });

      if (!res.ok) throw new Error();
      onUpdate(base64);
      toast.success("Avatar updated!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center gap-6">
      {/* Avatar preview */}
      <div className="relative">
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-2xl font-semibold text-indigo-600">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Upload button */}
      <div>
        <label className="cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          {loading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
        <p className="text-xs text-gray-400 mt-1.5">JPG, PNG — max 1MB</p>
      </div>
    </div>
  );
}
