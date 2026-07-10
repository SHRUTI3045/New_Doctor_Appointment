import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  error:   { className: 'bg-red-50 text-danger border-red-200', icon: XCircle },
  info:    { className: 'bg-sky-50 text-sky-700 border-sky-200', icon: Info },
}

function ToastList({ toasts }) {
  return (
    <div className="fixed top-20 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const style = STYLES[t.type] || STYLES.info
          const Icon = style.icon
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-card-hover border max-w-[340px] min-w-[220px] ${style.className}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t.message}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const toast = {
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    info:    (msg) => show(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
