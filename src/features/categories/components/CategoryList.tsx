import { useState } from 'react'
import type { Category } from '../types/category.types'
import { useCategories, useDeleteCategory } from '../queries/category.queries'
import { CategoryForm } from './CategoryForm'
import { Button, Card, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, Spinner, Badge, EmptyState } from '@/components/ui'
import { Trash2, Edit2, Plus, Lock } from 'lucide-react'

export function CategoryList() {
  const { data, isLoading, error } = useCategories()
  const deleteMutation = useDeleteCategory()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
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
        <p>Erro ao carregar categorias</p>
      </div>
    )
  }

  const categories = data ?? []

  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categorias</h1>
          <Button onClick={() => { setSelectedCategory(null); setIsFormOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Crie sua primeira categoria para começar"
          action={
            <Button onClick={() => { setSelectedCategory(null); setIsFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          }
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              <CategoryForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div data-tour="categories-header" className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button data-tour="categories-new-btn" onClick={() => { setSelectedCategory(null); setIsFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div data-tour="categories-list" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{category.name}</span>
                  {category.isDefault && (
                    <Badge variant="default" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                { !category.isDefault ? (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelectedCategory(category); setIsFormOpen(true) }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <CategoryForm
              category={selectedCategory}
              onSuccess={() => { setIsFormOpen(false); setSelectedCategory(null) }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
