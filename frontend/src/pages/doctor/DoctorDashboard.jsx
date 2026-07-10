import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, Users, Wallet, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const cards = [
    { title: 'My Appointments', desc: 'View and manage all your appointments', to: '/doctor/appointments', icon: ClipboardList },
    { title: 'My Patients', desc: 'View list of assigned patients', to: '/doctor/patients', icon: Users },
    { title: 'My Earnings', desc: 'View earnings from completed appointments', to: '/doctor/earnings', icon: Wallet },
  ]
  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-2xl font-extrabold text-text">Doctor Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome, Dr. {user?.userName}</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
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
