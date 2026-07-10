import { cn } from '../../lib/utils'

export function Card({ className, gradient = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'relative bg-card border border-border rounded-xl shadow-card overflow-hidden',
        gradient && 'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-primary before:via-secondary before:to-accent',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}
