import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-soft hover:shadow-glow hover:scale-[1.03]',
        secondary: 'border border-border bg-white text-text hover:border-primary hover:text-primary hover:scale-[1.03]',
        ghost: 'text-muted hover:bg-slate-100 hover:text-text',
        danger: 'bg-red-50 text-danger hover:bg-red-100 hover:scale-[1.03]',
        success: 'bg-emerald-50 text-success hover:bg-emerald-100 hover:scale-[1.03]',
        link: 'text-primary hover:underline p-0 h-auto',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2.5',
        lg: 'text-[15px] px-6 py-3',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

const Button = forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'

export { Button, buttonVariants }
