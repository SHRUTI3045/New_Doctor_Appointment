import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus, CalendarClock, MessageSquareHeart, UserCircle, Clock, Hourglass, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0 })

  useEffect(() => {
    if (!user?.userId) return
    api.get(`/patients/by-user/${user.userId}`)
      .then(r => {
        const patientId = r.data.patientId
        return api.get(`/appointments/patient/${patientId}`)
      })
      .then(r => {
        const appts = r.data || []
        setStats({
          upcoming: appts.filter(a => a.appointmentStatus === 'APPROVED').length,
          pending: appts.filter(a => a.appointmentStatus === 'PENDING').length,
          completed: appts.filter(a => a.appointmentStatus === 'COMPLETED').length,
        })
      })
      .catch(() => {})
  }, [user])

  const cards = [
    { title: 'Book Appointment', desc: 'Schedule a visit with a doctor', to: '/patient/book', icon: CalendarPlus },
    { title: 'My Appointments', desc: 'View and track appointment status', to: '/patient/appointments', icon: CalendarClock },
    { title: 'Give Feedback', desc: 'Rate your doctor experience', to: '/patient/feedback', icon: MessageSquareHeart },
    { title: 'Update Profile', desc: 'Edit your personal information', to: '/patient/profile', icon: UserCircle },
  ]

  const statItems = [
    { label: 'Upcoming', value: stats.upcoming, icon: Clock },
    { label: 'Awaiting Approval', value: stats.pending, icon: Hourglass },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2 },
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-2xl font-extrabold text-text">Welcome, {user?.userName} 👋</h1>
        <p className="text-muted text-sm mt-1">Here's what's happening with your health journey.</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {statItems.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </span>
              <div>
                <div className="text-xl font-extrabold text-text leading-none">{s.value}</div>
                <div className="text-[11.5px] text-muted mt-0.5">{s.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
            <Link to={c.to} className="block group">
              <Card gradient hover className="p-6">
                <div className="flex items-start justify-between">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <c.icon className="w-5.5 h-5.5 text-primary" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div className="font-bold text-[15px] text-text mb-1">{c.title}</div>
                <div className="text-muted text-[13.5px]">{c.desc}</div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
