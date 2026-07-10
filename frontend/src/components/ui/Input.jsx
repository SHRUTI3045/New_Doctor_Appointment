import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(({ className, icon: Icon, rightElement, ...props }, ref) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" strokeWidth={2} />
    )}
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted/70 outline-none transition-all duration-200',
        'focus:border-primary focus:ring-2 focus:ring-primary/15',
        Icon && 'pl-10',
        rightElement && 'pr-10',
        className
      )}
      {...props}
    />
    {rightElement}
  </div>
))
Input.displayName = 'Input'

export const Select = forwardRef(({ className, icon: Icon, children, ...props }, ref) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" strokeWidth={2} />
    )}
    <select
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text outline-none transition-all duration-200 appearance-none',
        'focus:border-primary focus:ring-2 focus:ring-primary/15',
        Icon && 'pl-10',
        className
      )}
      {...props}
    >
      {children}
    </select>
  </div>
))
Select.displayName = 'Select'

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted/70 outline-none transition-all duration-200 resize-vertical',
      'focus:border-primary focus:ring-2 focus:ring-primary/15',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export function Label({ className, ...props }) {
  return <label className={cn('block text-xs font-semibold text-slate-600 mb-1.5', className)} {...props} />
}
