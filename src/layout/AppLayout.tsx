import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useEffect, useState } from 'react'

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    return stored === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
