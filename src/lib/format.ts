export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numAmount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date + 'T00:00:00'))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
