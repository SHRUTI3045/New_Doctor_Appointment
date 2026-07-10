import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Wallet, CheckCircle2, IndianRupee } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'

export default function DoctorEarnings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return }
    api.get('/doctors/by-user/' + user.userId)
      .then(r => api.get('/doctors/' + r.data.doctorId + '/earnings'))
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <button onClick={() => navigate('/doctor')} className="flex items-center gap-1.5 text-sm text-muted hover:text-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold text-text">My Earnings</h1>
      </div>

      {loading ? (
        <Card className="p-6"><Skeleton className="h-24 w-full" /></Card>
      ) : !data ? (
        <EmptyState icon={Wallet} title="No earnings data available" />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card gradient className="p-6 text-center">
                <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <IndianRupee className="w-5.5 h-5.5 text-primary" />
                </span>
                <div className="text-3xl font-extrabold text-primary">₹{data.totalEarnings?.toLocaleString('en-IN')}</div>
                <div className="text-[13px] text-muted mt-1">Total Earnings</div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
              <Card gradient className="p-6 text-center">
                <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-5.5 h-5.5 text-success" />
                </span>
                <div className="text-3xl font-extrabold text-success">{data.completedCount}</div>
                <div className="text-[13px] text-muted mt-1">Completed Appointments</div>
              </Card>
            </motion.div>
          </div>

          {data.appointments?.length > 0 && (
            <>
              <h2 className="text-base font-bold text-text mb-4">Completed Appointments</h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border">
                        {['Patient', 'Date', 'Prescription'].map(h => (
                          <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.appointments.map(a => (
                        <tr key={a.appointmentId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 text-[13.5px] text-text font-medium">{a.patient?.patientName}</td>
                          <td className="px-4 py-3 text-[13px] text-muted">{a.appointmentDate}</td>
                          <td className="px-4 py-3 text-[13px] text-muted">{a.prescription || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}
