// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { DarkModeToggle } from "@/components/shared/DarkModeToggle";
// const navItems = [
//   { label: "Dashboard", href: "/dashboard", icon: "▦" },
//   { label: "Portfolio", href: "/dashboard/portfolio", icon: "◉" },
//   { label: "Projects", href: "/dashboard/projects", icon: "◈" },
//   { label: "Experience", href: "/dashboard/experience", icon: "◷" },
//   { label: "Skills", href: "/dashboard/skills", icon: "◎" },
//   { label: "Certificates", href: "/dashboard/certificates", icon: "◻" },
//   { label: "Testimonials", href: "/dashboard/testimonials", icon: "◔" },
//   { label: "Analytics", href: "/dashboard/analytics", icon: "◐" },
//   { label: "Settings", href: "/dashboard/settings", icon: "◌" },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   function logout() {
//     localStorage.removeItem("token");
//     document.cookie = "token=; path=/; max-age=0";
//     router.push("/login");
//   }

//   return (
//     <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
//       {/* Logo */}
//       <div className="px-5 py-5 border-b border-gray-100">
//         <span className="text-lg font-semibold text-gray-900">
//           Portfolio<span className="text-indigo-600">Craft</span>
//         </span>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 py-4 overflow-y-auto">
//         {navItems.map((item) => {
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
//                 active
//                   ? "bg-indigo-50 text-indigo-600 font-medium"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`}
//             >
//               <span className="text-base">{item.icon}</span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//       {/* Logout */}
//       <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
//         <button
//           onClick={logout}
//           className="text-sm text-gray-500 hover:text-red-500 transition-colors"
//         >
//           Sign out
//         </button>
//         <DarkModeToggle />
//       </div>
//     </aside>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import { DarkModeToggle } from "@/components/shared/DarkModeToggle";

// const navItems = [
//   { label: "Dashboard", href: "/dashboard", icon: "▦" },
//   { label: "Portfolio", href: "/dashboard/portfolio", icon: "◉" },
//   { label: "Projects", href: "/dashboard/projects", icon: "◈" },
//   { label: "Experience", href: "/dashboard/experience", icon: "◷" },
//   { label: "Skills", href: "/dashboard/skills", icon: "◎" },
//   { label: "Certificates", href: "/dashboard/certificates", icon: "◻" },
//   { label: "Testimonials", href: "/dashboard/testimonials", icon: "◔" },
//   { label: "Analytics", href: "/dashboard/analytics", icon: "◐" },
//   { label: "Settings", href: "/dashboard/settings", icon: "◌" },
//   { label: "Billing", href: "/dashboard/settings/billing", icon: "◈" },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [open, setOpen] = useState(false);

//   function logout() {
//     localStorage.removeItem("token");
//     document.cookie = "token=; path=/; max-age=0";
//     router.push("/login");
//   }

//   return (
//     <>
//       {/* Mobile topbar */}
//       <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
//         <span className="text-lg font-semibold text-gray-900 dark:text-white">
//           Portfolio<span className="text-indigo-600">Craft</span>
//         </span>
//         <button
//           onClick={() => setOpen(!open)}
//           className="text-gray-600 dark:text-gray-300 text-2xl"
//         >
//           {open ? "✕" : "☰"}
//         </button>
//       </div>

//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="md:hidden fixed inset-0 z-40 bg-black/50"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//         fixed top-0 left-0 h-screen z-50 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col
//         w-56 transition-transform duration-300
//         md:translate-x-0
//         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//       `}
//       >
//         {/* Logo */}
//         <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
//           <span className="text-lg font-semibold text-gray-900 dark:text-white">
//             Portfolio<span className="text-indigo-600">Craft</span>
//           </span>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 py-4 overflow-y-auto">
//           {navItems.map((item) => {
//             const active = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setOpen(false)}
//                 className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
//                   active
//                     ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium"
//                     : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
//                 }`}
//               >
//                 <span className="text-base">{item.icon}</span>
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom */}
//         <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
//           <button
//             onClick={logout}
//             className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
//           >
//             Sign out
//           </button>
//           <DarkModeToggle />
//         </div>
//       </aside>
//     </>
//   );
// }
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
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
  function logout() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio<span className="text-indigo-600">Craft</span>
        </span>
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
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen z-50 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col
        w-56 transition-transform duration-300
        md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio<span className="text-indigo-600">Craft</span>
          </span>
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
        {/* {username && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <a
              href={`http://localhost:3000/${username}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition font-medium"
            >
              Preview Portfolio →
            </a>
          </div>
        )} */}
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
