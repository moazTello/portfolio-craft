// import Sidebar from '@/components/dashboard/Sidebar'

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <main className="flex-1 ml-56 p-8">
//         {children}
//       </main>
//     </div>
//   )
// }
// import Sidebar from '@/components/dashboard/Sidebar'

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
//       <Sidebar />
//       <main className="flex-1 md:ml-56 p-4 md:p-8 pt-16 md:pt-8">
//         {children}
//       </main>
//     </div>
//   )
// }

import Sidebar from '@/components/dashboard/Sidebar'
import { ServerStatus } from '@/components/shared/ServerStatus'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 md:ml-56 p-4 md:p-8 pt-16 md:pt-8">
        <ServerStatus />
        {children}
      </main>
    </div>
  )
}