import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { MoonIcon, SunIcon, ArrowLeftOnRectangleIcon, BellIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useCurrentUser, useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useCurrentMonthAlertCount } from '@/features/alerts/queries/alert.queries'
import { HelpModal } from '@/components/HelpModal'
import { useTour } from '@/hooks/useTour'
import { MapIcon } from '@heroicons/react/24/outline'

type TopbarProps = {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Topbar({ isSidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const alertCount = useCurrentMonthAlertCount()
  const [isDark, setIsDark] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const { startTour } = useTour()

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const isDarkMode = storedTheme === 'dark'

    setIsDark(isDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      if (!storedTheme) {
        localStorage.setItem('theme', 'light')
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const root = document.documentElement
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login')
  }

  return (
    <>
    <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="hidden md:inline-flex rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.fullName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-tour="tour-button"
            onClick={startTour}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Tour guiado"
            title="Tour guiado — conheça o sistema completo"
          >
            <MapIcon className="h-5 w-5" />
          </button>
          <button
            data-tour="help-button"
            onClick={() => setIsHelpOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Ajuda"
            title="Ajuda — como usar esta tela"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
          <Link
            to="/alerts"
            className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            title="Alertas financeiros"
          >
            <BellIcon className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          <Button
            variant="ghost"
            size="default"
            onClick={handleLogout}
            className="gap-2"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
    </>
  )
}
