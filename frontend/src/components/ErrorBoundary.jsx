import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center text-center px-6 py-24 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-warning" />
          </div>
          <h2 className="text-xl font-extrabold text-text mb-2">Something went wrong</h2>
          <p className="text-muted text-sm leading-relaxed mb-7">
            An unexpected error occurred. Your data is safe — just refresh to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm px-7 py-2.5 rounded-xl shadow-soft hover:shadow-glow hover:scale-[1.03] transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
