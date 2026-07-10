import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Stethoscope, CalendarClock, Hourglass, ArrowRight, BarChart3 } from 'lucide-react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'

const STATUS_COLORS = { PENDING: 'bg-warning', APPROVED: 'bg-accent', COMPLETED: 'bg-primary', REJECTED: 'bg-danger', CANCELLED: 'bg-slate-400' }

function BarChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null
  const items = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(...items.map(([, v]) => v), 1)
  return (
    <Card gradient className="p-6 mb-8">
      <h3 className="flex items-center gap-2 text-[15px] font-bold text-text mb-5">
        <BarChart3 className="w-4.5 h-4.5 text-primary" /> Appointments by Status
      </h3>
      {items.map(([status, count]) => (
        <div key={status} className="mb-3.5 last:mb-0">
          <div className="flex justify-between mb-1.5">
            <span className="text-[12.5px] font-medium text-text">{status}</span>
            <span className="text-[12.5px] text-muted">{count}</span>
          </div>
          <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: (count / max * 100) + '%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${STATUS_COLORS[status] || 'bg-slate-400'}`}
            />
          </div>
        </div>
      ))}
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, pending: 0 })
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    Promise.all([
      api.get('/patients'),
      api.get('/doctors/list'),
      api.get('/appointments'),
      api.get('/admin/stats').catch(() => ({ data: {} })),
    ]).then(([p, d, a, st]) => {
      setStats({
        patients: p.data.length,
        doctors: d.data.length,
        appointments: a.data.length,
        pending: a.data.filter(x => x.appointmentStatus === 'PENDING').length,
      })
      if (st.data?.byStatus) setChartData(st.data.byStatus)
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Patients', value: stats.patients, icon: Users, to: '/admin/patients' },
    { label: 'Total Doctors', value: stats.doctors, icon: Stethoscope, to: '/admin/doctors' },
    { label: 'Appointments', value: stats.appointments, icon: CalendarClock, to: '/admin/appointments' },
    { label: 'Pending Approval', value: stats.pending, icon: Hourglass, to: '/admin/appointments' },
  ]

  const navItems = [
    { title: 'Manage Patients', desc: 'Add, edit, remove patients', to: '/admin/patients', icon: Users },
    { title: 'Manage Doctors', desc: 'Add, edit, remove doctors', to: '/admin/doctors', icon: Stethoscope },
    { title: 'Manage Appointments', desc: 'Approve, reject, view all', to: '/admin/appointments', icon: CalendarClock },
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-extrabold text-text mb-7">
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={c.to}>
              <Card gradient hover className="p-5">
                <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <c.icon className="w-4.5 h-4.5 text-primary" />
                </span>
                <div className="text-2xl font-extrabold text-text leading-none">{c.value}</div>
                <div className="text-[12px] text-muted mt-1.5">{c.label}</div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <BarChart data={chartData} />

      <h2 className="text-base font-bold text-text mb-4">Quick Access</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {navItems.map((n, i) => (
          <motion.div key={n.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
            <Link to={n.to} className="block group">
              <Card gradient hover className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <n.icon className="w-4.5 h-4.5 text-primary" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div className="font-bold text-[14.5px] text-text mb-0.5">{n.title}</div>
                <div className="text-muted text-[13px]">{n.desc}</div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
