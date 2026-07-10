import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}
