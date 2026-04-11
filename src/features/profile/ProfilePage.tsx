import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { Badge, Button, ConfirmDialog, Spinner } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useDeleteMe, useMe } from './queries/profile.queries'

export default function ProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: user, isLoading, error } = useMe()
  const deleteMutation = useDeleteMe()

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        logout()
        queryClient.clear()
        navigate('/login', { replace: true })
      },
      onError: () => {
        setConfirmOpen(false)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        Não foi possível carregar os dados do perfil.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Suas informações pessoais e configurações de conta.
        </p>
      </div>

      {/* Profile card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Avatar banner */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Info rows */}
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <InfoRow
            icon={<UserCircleIcon className="h-5 w-5" />}
            label="Nome completo"
            value={user.fullName}
          />
          <InfoRow
            icon={<EnvelopeIcon className="h-5 w-5" />}
            label="E-mail"
            value={user.email}
          />
          <InfoRow
            icon={<ShieldCheckIcon className="h-5 w-5" />}
            label="Perfis"
            value={
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge
                    key={role}
                    className={
                      role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20'
                        : undefined
                    }
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            }
          />
          <InfoRow
            icon={
              user.isActive ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-gray-400" />
              )
            }
            label="Status"
            value={
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    user.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {user.isActive ? 'Ativa' : 'Inativa'}
              </span>
            }
          />
        </dl>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 dark:border-red-900/50 dark:bg-red-950/30">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
          Zona de perigo
        </h2>
        <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70">
          A exclusão da conta é permanente e irreversível. Todos os seus dados — transações,
          contas e categorias — serão apagados.
        </p>
        <div className="mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            Excluir minha conta
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir conta"
        description={`Tem certeza que deseja excluir a conta de "${user.fullName}"? Esta ação é permanente e não pode ser desfeita.`}
        confirmLabel="Sim, excluir minha conta"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

// ─── helper component ────────────────────────────────────────────────────────

type InfoRowProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <div className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value}</dd>
      </div>
    </div>
  )
}
