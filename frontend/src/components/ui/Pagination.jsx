import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 py-4 border-t border-border">
      <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </Button>
      <span className="text-[13px] text-muted min-w-[100px] text-center">
        Page {page} of {pages} <span className="text-muted/70">({total} total)</span>
      </span>
      <Button size="sm" variant="secondary" disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next <ChevronRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}
