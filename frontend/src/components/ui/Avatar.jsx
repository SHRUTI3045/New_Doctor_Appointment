import { cn } from '../../lib/utils'

const GRADIENTS = [
  'from-primary to-secondary',
  'from-accent to-primary',
  'from-secondary to-accent',
  'from-primary to-accent',
]

function hashStr(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function Avatar({ name = '', size = 'md', className }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const gradient = GRADIENTS[hashStr(name) % GRADIENTS.length]
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' }
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full bg-gradient-to-br text-white font-bold flex-shrink-0', gradient, sizes[size], className)}>
      {initials}
    </span>
  )
}
