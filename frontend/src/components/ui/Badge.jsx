import { cn } from '../../lib/utils'

const STYLES = {
  PENDING:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  APPROVED:  'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  CONFIRMED: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  REJECTED:  'bg-red-50 text-red-700 ring-1 ring-red-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  DEFAULT:   'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
}

export function StatusBadge({ status, className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide whitespace-nowrap',
      STYLES[status] || STYLES.DEFAULT,
      className
    )}>
      {status}
    </span>
  )
}

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide bg-primary/10 text-primary', className)}
      {...props}
    />
  )
}
