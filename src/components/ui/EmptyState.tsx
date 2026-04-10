import type { ComponentType, SVGProps } from 'react'

type EmptyStateProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      {Icon && <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600" />}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
