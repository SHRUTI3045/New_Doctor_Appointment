import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

export function StarRating({ value = 0, count, size = 'sm', className }) {
  const px = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            className={px}
            fill={n <= Math.round(value) ? '#F59E0B' : 'none'}
            stroke={n <= Math.round(value) ? '#F59E0B' : '#CBD5E1'}
            strokeWidth={1.75}
          />
        ))}
      </div>
      {value > 0 && <span className="text-xs font-semibold text-text ml-0.5">{value}</span>}
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </div>
  )
}
