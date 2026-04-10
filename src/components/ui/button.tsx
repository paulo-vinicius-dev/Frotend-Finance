import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-blue-600 text-white shadow-sm hover:-translate-y-[1px] hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-400",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-[1px] hover:shadow-md hover:brightness-110",
        outline:
          "border border-gray-300 bg-white text-gray-800 shadow-sm hover:-translate-y-[1px] hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        secondary:
          "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:-translate-y-[1px] hover:bg-blue-100 hover:shadow-md dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/50",
        ghost:
          "border border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 shadow-none hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
