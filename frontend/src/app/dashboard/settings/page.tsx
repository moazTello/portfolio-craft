"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AvatarUploader } from "@/components/dashboard/AvatarUploader";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
import { useRef } from "react";

// const profileSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email"),
// });

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  telegramChatId: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Min 8 characters"),
    newPassword: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Min 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">(
    "profile",
  );
  const [avatar, setAvatar] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [customDomain, setCustomDomain] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainVerified, setDomainVerified] = useState<boolean | null>(null);
  const [userPlan, setUserPlan] = useState("FREE");

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    // fetch("http://localhost:3001/v1/auth/me", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // })
    api
      .get("/auth/me")
      .then((res) => res.json())
      .then((data) => {
        profileForm.reset({
          name: data.name,
          email: data.email,
          telegramChatId: data.telegramChatId ?? "",
        });
        setLoading(false);
        setAvatar(data.avatarUrl);
      });

    api
      .get("/portfolios/mine")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setUsernameInput(data.username);
      })
      .catch(() => {});

    api
      .get("/auth/me")
      .then((r) => r.json())
      .then((d) => setUserPlan(d.plan ?? "FREE"));
    api
      .get("/portfolios/mine")
      .then((r) => r.json())
      .then((d) => {
        setCustomDomain(d.customDomain ?? "");
        setDomainInput(d.customDomain ?? "");
      });
  }, []);

  async function onProfileSubmit(values: ProfileValues) {
    try {
      // const res = await fetch("http://localhost:3001/v1/users/me", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      //   body: JSON.stringify(values),
      // });
      const res = await api.patch("/users/me", values);
      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function onPasswordSubmit(values: PasswordValues) {
    try {
      // const res = await fetch("http://localhost:3001/v1/users/me/password", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      //   body: JSON.stringify({
      //     currentPassword: values.currentPassword,
      //     newPassword: values.newPassword,
      //   }),
      // });
      const res = await api.patch("/users/me/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (!res.ok) throw new Error();
      toast.success("Password changed!");
      passwordForm.reset();
    } catch {
      toast.error("Current password is incorrect");
    }
  }

  async function deleteAccount() {
    if (!confirm("Are you sure? This will delete everything permanently!"))
      return;
    try {
      // await fetch("http://localhost:3001/v1/users/me", {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.delete("/users/me");
      localStorage.clear();
      document.cookie = "token=; path=/; max-age=0";
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  // if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (loading)
    return (
      <div>
        <LoadingSkeleton rows={4} />
      </div>
    );
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "username", label: "Username" },
    { id: "password", label: "Password" },
    { id: "danger", label: "Danger Zone" },
    { id: "domain", label: "Custom Domain" },
  ];
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Profile Info
          </h2>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-4">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Profile Photo
            </h2>
            <AvatarUploader
              currentAvatar={avatar}
              name={profileForm.getValues("name")}
              onUpdate={setAvatar}
            />
          </div>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                {...profileForm.register("name")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {profileForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...profileForm.register("email")}
                type="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {profileForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telegram Chat ID
              </label>
              <input
                {...profileForm.register("telegramChatId")}
                placeholder="Your Telegram Chat ID"
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Get your Chat ID from{" "}
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  className="text-indigo-500 hover:underline"
                >
                  @userinfobot
                </a>{" "}
                on Telegram
              </p>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telegram Notifications
              </label>

              {/* Steps */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mb-3">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                  To receive Telegram notifications:
                </p>
                <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
                  <li>
                    Open Telegram and search for your bot or{" "}
                    <a
                      href="https://t.me/@portfoliocraft_notify_bot"
                      target="_blank"
                      className="underline font-medium"
                    >
                      click here to open it
                    </a>
                  </li>
                  <li>
                    Press <strong>Start</strong> to activate the bot
                  </li>
                  <li>
                    Get your Chat ID from{" "}
                    <a
                      href="https://t.me/userinfobot"
                      target="_blank"
                      className="underline font-medium"
                    >
                      @userinfobot
                    </a>
                  </li>
                  <li>Paste your Chat ID below</li>
                </ol>
              </div>

              <input
                {...profileForm.register("telegramChatId")}
                placeholder="e.g. 123456789"
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await api.post("/messages/test-telegram");
                    if (res.ok) toast.success("Test message sent to Telegram!");
                    else
                      toast.error(
                        "Failed — make sure you started the bot first",
                      );
                  } catch {
                    toast.error("Something went wrong");
                  }
                }}
                className="mt-2 text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
              >
                Test Telegram →
              </button>
            </div>

            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {profileForm.formState.isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Change Password
          </h2>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                {...passwordForm.register("currentPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                {...passwordForm.register("newPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                {...passwordForm.register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {passwordForm.formState.isSubmitting
                ? "Changing..."
                : "Change Password"}
            </button>
          </form>
        </div>
      )}
      {activeTab === "username" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            Custom Username
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Your portfolio URL:{" "}
            <span className="text-indigo-600">
              localhost:3000/{usernameInput || username}
            </span>
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  value={usernameInput}
                  // onChange={async (e) => {
                  //   const val = e.target.value
                  //     .toLowerCase()
                  //     .replace(/[^a-z0-9_-]/g, "");
                  //   setUsernameInput(val);
                  //   setUsernameAvailable(null);

                  //   if (val.length >= 3 && val !== username) {
                  //     // Check availability
                  //     try {
                  //       const res = await api.get(`/portfolios/public/${val}`);
                  //       setUsernameAvailable(res.status === 404);
                  //     } catch {
                  //       setUsernameAvailable(true);
                  //     }
                  //   }
                  // }}
                  onChange={async (e) => {
                    const val = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_-]/g, "");
                    setUsernameInput(val);
                    setUsernameAvailable(null);

                    // امسح الـ timeout القديم
                    if (debounceRef.current) clearTimeout(debounceRef.current);

                    if (val.length >= 3 && val !== username) {
                      // انتظر 500ms بعد ما يوقف الكتابة
                      debounceRef.current = setTimeout(async () => {
                        try {
                          const res = await api.get(
                            `/portfolios/public/${val}`,
                          );
                          setUsernameAvailable(res.status === 404);
                        } catch {
                          setUsernameAvailable(true);
                        }
                      }, 1000);
                    }
                  }}
                  placeholder="your-username"
                  maxLength={30}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                {usernameInput.length >= 3 && usernameInput !== username && (
                  <span className="absolute right-3 top-2.5 text-sm">
                    {usernameAvailable === null
                      ? "..."
                      : usernameAvailable
                        ? "✅"
                        : "❌"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                3-30 characters, lowercase letters, numbers, _ or - only
              </p>
              {usernameAvailable === false && (
                <p className="text-red-500 text-xs mt-1">
                  Username already taken
                </p>
              )}
              {usernameAvailable === true && (
                <p className="text-green-500 text-xs mt-1">
                  Username available!
                </p>
              )}
            </div>

            <button
              onClick={async () => {
                if (!usernameInput || usernameInput === username) return;
                if (usernameAvailable === false) return;
                setUsernameLoading(true);
                try {
                  const res = await api.patch("/portfolios/mine/username", {
                    username: usernameInput,
                  });
                  if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message);
                  }
                  setUsername(usernameInput);
                  setUsernameAvailable(null);
                  toast.success("Username updated!");
                  window.dispatchEvent(
                    new CustomEvent("portfolio-status-changed", {
                      detail: { published: true },
                    }),
                  );
                  window.dispatchEvent(
                    new CustomEvent("portfolio-username-changed", {
                      detail: { username: usernameInput },
                    }),
                  );
                } catch (err: any) {
                  toast.error(err.message || "Something went wrong");
                } finally {
                  setUsernameLoading(false);
                }
              }}
              disabled={
                usernameLoading ||
                usernameInput === username ||
                usernameInput.length < 3 ||
                usernameAvailable === false
              }
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {usernameLoading ? "Saving..." : "Save Username"}
            </button>
          </div>
        </div>
      )}
      {/* Danger Zone Tab */}
      {activeTab === "danger" && (
        <div className="bg-white border border-red-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-red-600 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Once you delete your account, all your data will be permanently
            removed.
          </p>
          <button
            onClick={deleteAccount}
            className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            Delete My Account
          </button>
        </div>
      )}

      {activeTab === "domain" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            Custom Domain
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Point your own domain to your portfolio
          </p>

          {["FREE"].includes(userPlan) ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-4">🔒</p>
              <p className="text-gray-500 text-sm mb-4">
                Custom domain is available on Pro and Business plans
              </p>
              <a
                href="/dashboard/settings/billing"
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Upgrade Now →
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">
                  How to set up your domain:
                </p>
                <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-2 list-decimal list-inside">
                  <li>
                    Go to your domain registrar (Namecheap, GoDaddy, etc.)
                  </li>
                  <li>
                    Add a <strong>CNAME</strong> record:
                  </li>
                </ol>
                <div className="mt-3 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-3 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-2 text-blue-700 dark:text-blue-300">
                    <div>
                      <p className="text-gray-400 mb-1">Type</p>
                      <p className="font-bold">CNAME</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Name</p>
                      <p className="font-bold">@ or www</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Value</p>
                      <p className="font-bold">portfoliocraft.com</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                  ⏱ DNS changes may take up to 24-48 hours to propagate
                </p>
              </div>

              {/* Domain Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Domain
                </label>
                <div className="flex gap-2">
                  <input
                    value={domainInput}
                    onChange={(e) => {
                      setDomainInput(e.target.value);
                      setDomainVerified(null);
                    }}
                    placeholder="yourdomain.com"
                    className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={async () => {
                      if (!domainInput) return;
                      setDomainLoading(true);
                      try {
                        const res = await api.patch(
                          "/portfolios/mine/custom-domain",
                          {
                            domain: domainInput,
                          },
                        );
                        if (!res.ok) {
                          const data = await res.json();
                          throw new Error(data.message);
                        }
                        setCustomDomain(domainInput);
                        toast.success("Domain saved!");
                      } catch (err: any) {
                        toast.error(err.message);
                      } finally {
                        setDomainLoading(false);
                      }
                    }}
                    disabled={domainLoading || !domainInput}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {domainLoading ? "Saving..." : "Save"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter without http:// — example: myportfolio.com
                </p>
              </div>

              {/* Verify */}
              {customDomain && (
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {customDomain}
                      </p>
                      {domainVerified === true && (
                        <p className="text-xs text-green-600 mt-0.5">
                          ✅ Domain verified and active
                        </p>
                      )}
                      {domainVerified === false && (
                        <p className="text-xs text-red-500 mt-0.5">
                          ❌ DNS not configured yet
                        </p>
                      )}
                      {domainVerified === null && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Click verify to check DNS status
                        </p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.post(
                            "/portfolios/mine/verify-domain",
                          );
                          const data = await res.json();
                          setDomainVerified(data.verified);
                          if (data.verified) {
                            toast.success("Domain verified! 🎉");
                          } else {
                            toast.error(
                              "DNS not configured yet. Please check your CNAME record.",
                            );
                          }
                        } catch (err: any) {
                          toast.error(err.message);
                        }
                      }}
                      className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                    >
                      Check DNS →
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={async () => {
                      if (!confirm("Remove custom domain?")) return;
                      try {
                        await api.patch("/portfolios/mine/custom-domain", {
                          domain: null,
                        });
                        setCustomDomain("");
                        setDomainInput("");
                        setDomainVerified(null);
                        toast.success("Domain removed");
                      } catch (err: any) {
                        toast.error(err.message);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Remove domain
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
