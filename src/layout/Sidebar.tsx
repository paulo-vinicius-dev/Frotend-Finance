import { NavLink } from 'react-router-dom'
import {
  Squares2X2Icon,
  BanknotesIcon,
  BuildingLibraryIcon,
  TagIcon,
  ChartBarIcon,
  WalletIcon,
  LightBulbIcon,
  BellIcon,
  ArrowPathIcon,
  UsersIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import { useCurrentUser } from '@/store/authStore'

type SidebarProps = {
  isCollapsed: boolean
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Squares2X2Icon },
  { label: 'Transações', to: '/transactions', icon: BanknotesIcon },
  { label: 'Contas', to: '/accounts', icon: BuildingLibraryIcon },
  { label: 'Categorias', to: '/categories', icon: TagIcon },
  { label: 'Recorrências', to: '/recurring', icon: ArrowPathIcon },
  { label: 'Relatórios', to: '/reports', icon: ChartBarIcon },
  { label: 'Orçamentos', to: '/budgets', icon: WalletIcon },
  { label: 'Insights', to: '/insights', icon: LightBulbIcon },
  { label: 'Alertas', to: '/alerts', icon: BellIcon },
]

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const user = useCurrentUser()
  const isAdmin = user?.roles?.includes('ADMIN') ?? false

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200',
        isCollapsed ? 'w-0 border-r-0' : 'w-64'
      )}
    >
      <div className={cn('py-4', isCollapsed ? 'px-0' : 'px-6')}>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center md:text-left">
          Finance
        </h1>
      </div>
      <nav className={cn('flex-1 space-y-1 py-4 overflow-y-auto', isCollapsed ? 'px-0' : 'px-3')}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'gap-3',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          )
        })}

        {isAdmin && (
          <>
            <div className={cn('mt-4 mb-1', isCollapsed ? 'px-0' : 'px-3')}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                Administração
              </p>
            </div>
            <NavLink
              to="/admin/users"
              title="Usuários"
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors gap-3',
                  isActive
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                )
              }
            >
              <UsersIcon className="h-5 w-5 shrink-0" />
              Usuários
            </NavLink>
          </>
        )}
      </nav>

      {/* Profile footer */}
      <div className={cn('border-t border-gray-200 dark:border-gray-800 py-3', isCollapsed ? 'px-0' : 'px-3')}>
        <NavLink
          to="/profile"
          title="Meu Perfil"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors gap-3',
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            )
          }
        >
          <UserCircleIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">{user?.fullName ?? 'Meu Perfil'}</span>
        </NavLink>
      </div>
    </aside>
  )
}
