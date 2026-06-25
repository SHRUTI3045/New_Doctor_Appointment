import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      if (data.role === 'ADMIN') navigate('/admin')
      else if (data.role === 'DOCTOR') navigate('/doctor')
      else navigate('/patient')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Welcome back</h2>
        <p style={s.sub}>Sign in to your account</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Username</label>
          <input style={s.input} value={form.userName}
            onChange={e => setForm(p => ({...p, userName: e.target.value}))}
            placeholder="Enter username" required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password}
            onChange={e => setForm(p => ({...p, password: e.target.value}))}
            placeholder="Enter password" required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={s.foot}>No account? <Link to="/register" style={s.link}>Register</Link></p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f9' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '400px' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 600 },
  sub: { margin: '0 0 24px', color: '#637082', fontSize: '14px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px', marginTop: '16px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px', outline: 'none' },
  btn: { width: '100%', marginTop: '24px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  foot: { textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: '#637082' },
  link: { color: '#0b7065', fontWeight: 500 },
}
