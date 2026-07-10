import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartPulse, User, Lock, Mail, Phone, Cake, MapPin, Droplet, ArrowRight } from 'lucide-react'
import api from '../../api/axios'
import { Button } from '../../components/ui/Button'
import { Input, Select, Label } from '../../components/ui/Input'

export default function Register() {
  const [form, setForm] = useState({
    userName: '', password: '', patientName: '', email: '',
    mobileNo: '', bloodGroup: '', gender: '', age: '', address: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { ...form, role: 'PATIENT', age: Number(form.age) })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-card p-8 sm:p-10"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </span>
          <span className="font-extrabold text-xl text-text tracking-tight">MediBook</span>
        </div>

        <h2 className="text-2xl font-extrabold text-text mb-1">Create your account</h2>
        <p className="text-muted text-sm mb-7">Join MediBook as a patient — it only takes a minute</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-5 border border-red-100"
          >
            {String(error)}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field icon={User} label="Username" value={form.userName} onChange={set('userName')} placeholder="Choose a username" />
            <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field icon={User} label="Full Name" value={form.patientName} onChange={set('patientName')} placeholder="Your full name" />
            <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field icon={Phone} label="Mobile No." value={form.mobileNo} onChange={set('mobileNo')} placeholder="+91 XXXXX XXXXX" />
            <Field icon={Cake} label="Age" type="number" value={form.age} onChange={set('age')} placeholder="Age" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onChange={set('gender')} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select icon={Droplet} value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
              </Select>
            </div>
            <Field icon={MapPin} label="Address" value={form.address} onChange={set('address')} placeholder="City, State" />
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full mt-2 group">
            {loading ? 'Creating account…' : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-7">
          Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

function Field({ icon, label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input icon={icon} type={type} value={value} onChange={onChange} placeholder={placeholder} required />
    </div>
  )
}
