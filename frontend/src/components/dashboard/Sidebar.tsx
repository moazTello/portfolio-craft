"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";
import { api } from "@/lib/api";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },

  // الأساسيات
  { label: "Portfolio", href: "/dashboard/portfolio", icon: "◉" },
  { label: "Projects", href: "/dashboard/projects", icon: "◈" },
  { label: "Experience", href: "/dashboard/experience", icon: "◷" },
  { label: "Skills", href: "/dashboard/skills", icon: "◎" },
  { label: "Certificates", href: "/dashboard/certificates", icon: "◻" },

  // المحتوى الإضافي
  { label: "Blog", href: "/dashboard/blog", icon: "✍️" },
  { label: "Gallery", href: "/dashboard/gallery", icon: "🖼" },
  { label: "Services", href: "/dashboard/services", icon: "🛠" },
  { label: "Clients", href: "/dashboard/clients", icon: "🤝" },
  { label: "Achievements", href: "/dashboard/achievements", icon: "🏆" },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: "◔" },

  // التفاعل
  { label: "Messages", href: "/dashboard/messages", icon: "✉️" },
  { label: "Booking", href: "/dashboard/booking", icon: "📅" },
  { label: "Business Cards", href: "/dashboard/business-cards", icon: "🎴" },

  // البيانات والإدارة
  { label: "Analytics", href: "/dashboard/analytics", icon: "◐" },
  { label: "Billing", href: "/dashboard/settings/billing", icon: "$" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙︎" },
];
//this is the most aggressive symbol in the IRS
// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.portfolio-craft.com').replace(/\/$/, '')
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [published, setPublished] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  // useEffect(() => {
  //   api
  //     .get("/portfolios/mine")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data?.username) setUsername(data.username);
  //       setPublished(data?.published ?? false);
  //     })
  //     .catch(() => {});

  //   const handler = (e: any) => setPublished(e.detail.published);
  //   window.addEventListener("portfolio-status-changed", handler);
  //   return () =>
  //     window.removeEventListener("portfolio-status-changed", handler);
  // }, []);
  useEffect(() => {
    api
      .get("/portfolios/mine")
      .then((res) => res.json())
      .then((data) => {
        if (data?.username) setUsername(data.username);
        setPublished(data?.published ?? false);
      })
      .catch(() => {});

    const publishHandler = (e: any) => setPublished(e.detail.published);
    window.addEventListener("portfolio-status-changed", publishHandler);

    // أضف هذا
    const usernameHandler = (e: any) => setUsername(e.detail.username);
    window.addEventListener("portfolio-username-changed", usernameHandler);

    api
      .get("/messages/mine/unread")
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
    api
      .get("/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.role === "ADMIN") setIsAdmin(true);
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("portfolio-status-changed", publishHandler);
      window.removeEventListener("portfolio-username-changed", usernameHandler);
    };
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  function logout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <>
      {/* Mobile topbar */}
      {/* <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio<span className="text-indigo-600">Craft</span>
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 dark:text-gray-300 text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div> */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg
            width="61"
            height="61"
            viewBox="0 0 61 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="61" height="61" rx="10" fill="#4F7CE7" />
            <path
              d="M9.64205 49V14.0909H24.0625C26.6761 14.0909 28.9318 14.6023 30.8295 15.625C32.7386 16.6364 34.2102 18.0511 35.2443 19.8693C36.2784 21.6761 36.7955 23.7784 36.7955 26.1761C36.7955 28.5852 36.267 30.6932 35.2102 32.5C34.1648 34.2955 32.6705 35.6875 30.7273 36.6761C28.7841 37.6648 26.4773 38.1591 23.8068 38.1591H14.9091V31.5114H22.2386C23.5114 31.5114 24.5739 31.2898 25.4261 30.8466C26.2898 30.4034 26.9432 29.7841 27.3864 28.9886C27.8295 28.1818 28.0511 27.2443 28.0511 26.1761C28.0511 25.0966 27.8295 24.1648 27.3864 23.3807C26.9432 22.5852 26.2898 21.9716 25.4261 21.5398C24.5625 21.108 23.5 20.892 22.2386 20.892H18.0795V49H9.64205Z"
              fill="white"
            />
            <path
              d="M43.3807 49.5167C40.6709 49.5167 38.3401 48.9426 36.3881 47.7944C34.4477 46.6347 32.955 45.0272 31.9102 42.9719C30.8768 40.9167 30.3601 38.5514 30.3601 35.8761C30.3601 33.1663 30.8825 30.7895 31.9274 28.7457C32.9837 26.6905 34.4821 25.0887 36.4226 23.9405C38.363 22.7808 40.6709 22.201 43.3462 22.201C45.6541 22.201 47.675 22.6201 49.4087 23.4583C51.1425 24.2965 52.5146 25.4734 53.525 26.989C54.5355 28.5046 55.0923 30.2843 55.1957 32.3281H48.272C48.0768 31.0077 47.5601 29.9456 46.7219 29.1419C45.8952 28.3266 44.8102 27.919 43.4668 27.919C42.3301 27.919 41.3369 28.229 40.4872 28.8491C39.649 29.4576 38.9946 30.3475 38.5238 31.5186C38.053 32.6898 37.8176 34.1078 37.8176 35.7727C37.8176 37.4606 38.0473 38.8958 38.5066 40.0785C38.9773 41.2611 39.6375 42.1625 40.4872 42.7825C41.3369 43.4025 42.3301 43.7125 43.4668 43.7125C44.305 43.7125 45.0571 43.5403 45.723 43.1958C46.4005 42.8514 46.9573 42.3519 47.3936 41.6974C47.8414 41.0315 48.1342 40.2335 48.272 39.3034H55.1957C55.0808 41.3243 54.5297 43.104 53.5423 44.6426C52.5663 46.1697 51.2172 47.3638 49.4949 48.225C47.7726 49.0861 45.7345 49.5167 43.3807 49.5167Z"
              fill="#0D1B3E"
            />
            <line
              x1="32.6985"
              y1="32.9743"
              x2="30.1004"
              y2="31.4743"
              stroke="white"
              strokeLinecap="round"
            />
            <line
              x1="30.9664"
              y1="31.9743"
              x2="29.0611"
              y2="30.8743"
              stroke="#0D1B3E"
              strokeLinecap="round"
            />
            <line
              x1="33.8203"
              y1="30.783"
              x2="31.2222"
              y2="29.283"
              stroke="white"
              strokeLinecap="round"
            />
            <line
              x1="32.0882"
              y1="29.783"
              x2="30.183"
              y2="28.683"
              stroke="#0D1B3E"
              strokeLinecap="round"
            />
            <line
              x1="34.8203"
              y1="28.783"
              x2="32.2222"
              y2="27.283"
              stroke="white"
              strokeLinecap="round"
            />
            <line
              x1="33.0882"
              y1="27.783"
              x2="31.183"
              y2="26.683"
              stroke="#0D1B3E"
              strokeLinecap="round"
            />
            <line
              x1="35.8203"
              y1="26.783"
              x2="33.2222"
              y2="25.283"
              stroke="white"
              strokeLinecap="round"
            />
            <line
              x1="34.0882"
              y1="25.783"
              x2="32.183"
              y2="24.683"
              stroke="#0D1B3E"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Portfolio
            <span className="text-indigo-600">Craft</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 dark:text-gray-300 text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className={`md:hidden fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen z-40 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col
        w-56 transition-transform duration-300
        md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        {/* <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio<span className="text-indigo-600">Craft</span>
          </span>
        </div> */}

        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <svg
              width="61"
              height="61"
              viewBox="0 0 61 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="61" height="61" rx="10" fill="#4F7CE7" />
              <path
                d="M9.64205 49V14.0909H24.0625C26.6761 14.0909 28.9318 14.6023 30.8295 15.625C32.7386 16.6364 34.2102 18.0511 35.2443 19.8693C36.2784 21.6761 36.7955 23.7784 36.7955 26.1761C36.7955 28.5852 36.267 30.6932 35.2102 32.5C34.1648 34.2955 32.6705 35.6875 30.7273 36.6761C28.7841 37.6648 26.4773 38.1591 23.8068 38.1591H14.9091V31.5114H22.2386C23.5114 31.5114 24.5739 31.2898 25.4261 30.8466C26.2898 30.4034 26.9432 29.7841 27.3864 28.9886C27.8295 28.1818 28.0511 27.2443 28.0511 26.1761C28.0511 25.0966 27.8295 24.1648 27.3864 23.3807C26.9432 22.5852 26.2898 21.9716 25.4261 21.5398C24.5625 21.108 23.5 20.892 22.2386 20.892H18.0795V49H9.64205Z"
                fill="white"
              />
              <path
                d="M43.3807 49.5167C40.6709 49.5167 38.3401 48.9426 36.3881 47.7944C34.4477 46.6347 32.955 45.0272 31.9102 42.9719C30.8768 40.9167 30.3601 38.5514 30.3601 35.8761C30.3601 33.1663 30.8825 30.7895 31.9274 28.7457C32.9837 26.6905 34.4821 25.0887 36.4226 23.9405C38.363 22.7808 40.6709 22.201 43.3462 22.201C45.6541 22.201 47.675 22.6201 49.4087 23.4583C51.1425 24.2965 52.5146 25.4734 53.525 26.989C54.5355 28.5046 55.0923 30.2843 55.1957 32.3281H48.272C48.0768 31.0077 47.5601 29.9456 46.7219 29.1419C45.8952 28.3266 44.8102 27.919 43.4668 27.919C42.3301 27.919 41.3369 28.229 40.4872 28.8491C39.649 29.4576 38.9946 30.3475 38.5238 31.5186C38.053 32.6898 37.8176 34.1078 37.8176 35.7727C37.8176 37.4606 38.0473 38.8958 38.5066 40.0785C38.9773 41.2611 39.6375 42.1625 40.4872 42.7825C41.3369 43.4025 42.3301 43.7125 43.4668 43.7125C44.305 43.7125 45.0571 43.5403 45.723 43.1958C46.4005 42.8514 46.9573 42.3519 47.3936 41.6974C47.8414 41.0315 48.1342 40.2335 48.272 39.3034H55.1957C55.0808 41.3243 54.5297 43.104 53.5423 44.6426C52.5663 46.1697 51.2172 47.3638 49.4949 48.225C47.7726 49.0861 45.7345 49.5167 43.3807 49.5167Z"
                fill="#0D1B3E"
              />
              <line
                x1="32.6985"
                y1="32.9743"
                x2="30.1004"
                y2="31.4743"
                stroke="white"
                strokeLinecap="round"
              />
              <line
                x1="30.9664"
                y1="31.9743"
                x2="29.0611"
                y2="30.8743"
                stroke="#0D1B3E"
                strokeLinecap="round"
              />
              <line
                x1="33.8203"
                y1="30.783"
                x2="31.2222"
                y2="29.283"
                stroke="white"
                strokeLinecap="round"
              />
              <line
                x1="32.0882"
                y1="29.783"
                x2="30.183"
                y2="28.683"
                stroke="#0D1B3E"
                strokeLinecap="round"
              />
              <line
                x1="34.8203"
                y1="28.783"
                x2="32.2222"
                y2="27.283"
                stroke="white"
                strokeLinecap="round"
              />
              <line
                x1="33.0882"
                y1="27.783"
                x2="31.183"
                y2="26.683"
                stroke="#0D1B3E"
                strokeLinecap="round"
              />
              <line
                x1="35.8203"
                y1="26.783"
                x2="33.2222"
                y2="25.283"
                stroke="white"
                strokeLinecap="round"
              />
              <line
                x1="34.0882"
                y1="25.783"
                x2="32.183"
                y2="24.683"
                stroke="#0D1B3E"
                strokeLinecap="round"
              />
            </svg>

            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                Portfolio<span className="text-indigo-600">Craft</span>
              </div>
              <div className="text-xs text-gray-400 leading-tight">
                Dashboard
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })} */}
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {item.label === "Messages" && unreadCount > 0 && (
                  <span className="ml-auto bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Preview Button */}
        {username && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-red-400 hover:bg-red-950 transition"
              >
                <span>⚙</span> Admin Panel
              </Link>
            )}
            {published ? (
              <a
                href={`${SITE_URL}/${username}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition font-medium"
              >
                Preview Portfolio →
              </a>
            ) : (
              <button
                onClick={() => toast.error("Publish your portfolio first!")}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 transition font-medium"
              >
                Portfolio Unpublished
              </button>
            )}
          </div>
        )}

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sign out
          </button>
          <DarkModeToggle />
        </div>
      </aside>
    </>
  );
}
