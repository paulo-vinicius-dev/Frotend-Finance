import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import AppLayout from '@/layout/AppLayout'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import AccountList from '@/features/accounts/AccountList'
import CategoryList from '@/features/categories/CategoryList'
import TransactionList from '@/features/transactions/TransactionList'
import ReportsPage from '@/features/reports/ReportsPage'
import BudgetsPage from '@/features/budgets/BudgetsPage'
import InsightsPage from '@/features/insights/InsightsPage'
import AlertsPage from '@/features/alerts/AlertsPage'
import RecurringPage from '@/features/recurring/RecurringPage'
import AdminUsersPage from '@/features/admin/AdminUsersPage'
import ProfilePage from '@/features/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionList /> },
          { path: 'accounts', element: <AccountList /> },
          { path: 'categories', element: <CategoryList /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'budgets', element: <BudgetsPage /> },
          { path: 'insights', element: <InsightsPage /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'recurring', element: <RecurringPage /> },
          { path: 'profile', element: <ProfilePage /> },
          // Admin-only routes
          {
            element: <AdminRoute />,
            children: [
              { path: 'admin/users', element: <AdminUsersPage /> },
            ],
          },
        ],
      },
    ],
  },
])
