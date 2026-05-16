import Sidebar from "@/components/dashboard/Sidebar";
import { ServerStatus } from "@/components/shared/ServerStatus";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 min-w-0 md:ml-56 p-4 md:p-8 pt-28 md:pt-8">
        <ServerStatus />
        {children}
      </main>
    </div>
  );
}
