import { Component } from 'react'

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
        <div style={{ textAlign: 'center', padding: '80px 40px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠</div>
          <h2 style={{ fontSize: '22px', color: '#1a1a2e', marginBottom: '10px' }}>Something went wrong</h2>
          <p style={{ color: '#637082', marginBottom: '28px', lineHeight: 1.6 }}>
            An unexpected error occurred. Your data is safe — just refresh to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#0b7065', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
