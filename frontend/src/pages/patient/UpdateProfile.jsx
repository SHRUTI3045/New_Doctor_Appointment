import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, IdCard, CalendarCheck2, Stethoscope, CheckCircle2, User, Phone, Mail, Cake, MapPin, Droplet } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select, Label } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { CardSkeleton } from '../../components/ui/Skeleton'

export default function UpdateProfile() {
  const [form, setForm] = useState({ patientName: '', mobileNo: '', email: '', bloodGroup: '', gender: '', age: '', address: '' })
  const [patientId, setPatientId] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, completed: 0, doctorsVisited: 0 })
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) return
    api.get('/patients/by-user/' + user.userId).then(r => {
      const p = r.data
      setPatientId(p.patientId)
      setForm({
        patientName: p.patientName || '',
        mobileNo: p.mobileNo || '',
        email: p.email || '',
        bloodGroup: p.bloodGroup || '',
        gender: p.gender || '',
        age: p.age || '',
        address: p.address || '',
      })
      setLoading(false)
      api.get('/appointments/patient/' + p.patientId).then(a => {
        const appts = a.data || []
        setStats({
          total: appts.length,
          completed: appts.filter(x => x.appointmentStatus === 'COMPLETED').length,
          doctorsVisited: new Set(appts.map(x => x.doctor?.doctorId)).size,
        })
      }).catch(() => {})
    }).catch(() => setLoading(false))
  }, [user])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) return
    try {
      await api.put('/patients/' + patientId, { ...form, age: Number(form.age) })
      setMsg('success:Profile updated successfully!')
      setTimeout(() => navigate('/patient'), 1800)
    } catch {
      setMsg('error:Failed to update profile.')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <CardSkeleton />
    </div>
  )

  const isSuccess = msg.startsWith('success:')
  const msgText = msg.replace(/^(success|error):/, '')

  const statItems = [
    { label: 'Appointments', value: stats.total, icon: CalendarCheck2 },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2 },
    { label: 'Doctors Visited', value: stats.doctorsVisited, icon: Stethoscope },
  ]

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card gradient className="p-7 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <Avatar name={form.patientName || '?'} size="xl" />
            <button
              type="button"
              onClick={() => toast?.info('Photo upload coming soon')}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-soft border border-border flex items-center justify-center text-primary hover:scale-110 transition-transform duration-200"
              aria-label="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-extrabold text-text">{form.patientName || 'Your Profile'}</h1>
            <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted mt-1">
              <IdCard className="w-3.5 h-3.5" /> Patient ID #{patientId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {statItems.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-3.5">
              <s.icon className="w-4.5 h-4.5 text-primary mb-0.5" />
              <span className="text-lg font-extrabold text-text leading-none">{s.value}</span>
              <span className="text-[11px] text-muted text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card gradient className="p-7 sm:p-8">
        <h2 className="text-base font-bold text-text mb-1">Personal Information</h2>
        <p className="text-sm text-muted mb-6">Keep your details up to date</p>

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-5 border ${isSuccess ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-danger border-red-100'}`}
            >
              {isSuccess && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              {msgText}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input icon={User} value={form.patientName} onChange={set('patientName')} required />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input icon={Phone} value={form.mobileNo} onChange={set('mobileNo')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input icon={Mail} type="email" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <Label>Age</Label>
              <Input icon={Cake} type="number" value={form.age} onChange={set('age')} min="0" max="150" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onChange={set('gender')}>
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
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
              </Select>
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input icon={MapPin} value={form.address} onChange={set('address')} placeholder="City, State" />
          </div>
          <Button type="submit" size="lg" className="w-full mt-2">Save Changes</Button>
        </form>
      </Card>
    </div>
  )
}
