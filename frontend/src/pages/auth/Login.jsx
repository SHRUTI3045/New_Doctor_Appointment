import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, User, Lock, Eye, EyeOff, ShieldCheck, CalendarCheck, Stethoscope, ArrowRight } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Input'

const BENEFITS = [
  { icon: CalendarCheck, text: 'Book appointments with top doctors in seconds' },
  { icon: Stethoscope, text: 'Track prescriptions and visit history in one place' },
  { icon: ShieldCheck, text: 'Your health data, secured and always private' },
]

export default function Login() {
  const [form, setForm] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
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
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </span>
          <span className="font-extrabold text-xl tracking-tight">MediBook</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md"
        >
          <h1 className="text-3xl font-extrabold leading-tight mb-3">
            Healthcare, made effortless.
          </h1>
          <p className="text-white/80 text-[15px] leading-relaxed mb-8">
            Welcome back to MediBook — your trusted platform for booking appointments, managing prescriptions, and staying on top of your care.
          </p>
          <div className="flex flex-col gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4.5 h-4.5" />
                </span>
                <span className="text-[14px] text-white/90">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-white/50 text-xs">© 2026 MediBook. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </span>
            <span className="font-extrabold text-xl text-text tracking-tight">MediBook</span>
          </div>

          <h2 className="text-2xl font-extrabold text-text mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-7">Sign in to continue to your dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-5 border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label>Username</Label>
              <Input
                icon={User}
                value={form.userName}
                onChange={e => setForm(p => ({ ...p, userName: e.target.value }))}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter your password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm -mt-1">
              <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                />
                Remember me
              </label>
              <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full mt-2 group">
              {loading ? 'Signing in…' : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-7">
            No account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
