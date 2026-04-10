import { useState } from 'react'
import type { Account } from '../types/account.types'
import { useAccounts, useDeleteAccount } from '../queries/account.queries'
import { AccountForm } from './AccountForm'
import { Button, Card, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, EmptyState } from '@/components/ui'
import { Trash2, Edit2, Plus } from 'lucide-react'

export function AccountList() {
  const { data, isLoading, error } = useAccounts()
  const deleteMutation = useDeleteAccount()
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        <p>Erro ao carregar contas</p>
      </div>
    )
  }

  const accounts = data ?? []

  if (accounts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Contas</h1>
          <Button onClick={() => { setSelectedAccount(null); setIsFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        <EmptyState
          title="Nenhuma conta encontrada"
          description="Crie sua primeira conta para começar"
          action={
            <Button onClick={() => { setSelectedAccount(null); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          }
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Conta</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              <AccountForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div data-tour="accounts-header" className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contas</h1>
        <Button data-tour="accounts-new-btn" onClick={() => { setSelectedAccount(null); setIsFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <div data-tour="accounts-list" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{account.name}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedAccount(account); setIsFormOpen(true) }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(account.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAccount ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <AccountForm
              account={selectedAccount}
              onSuccess={() => { setIsFormOpen(false); setSelectedAccount(null) }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
