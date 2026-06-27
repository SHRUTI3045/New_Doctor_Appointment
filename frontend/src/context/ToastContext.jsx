import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const STYLES = {
  success: { background: '#d1fae5', color: '#065f46', borderLeft: '4px solid #10b981' },
  error:   { background: '#fee2e2', color: '#991b1b', borderLeft: '4px solid #ef4444' },
  info:    { background: '#dbeafe', color: '#1e3a5f', borderLeft: '4px solid #3b82f6' },
}

function ToastList({ toasts }) {
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', top: '72px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxWidth: '340px', minWidth: '220px',
          ...STYLES[t.type]
        }}>
          {t.message}
        </div>
      ))}
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
