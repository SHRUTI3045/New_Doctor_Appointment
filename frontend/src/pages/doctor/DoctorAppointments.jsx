import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ClipboardList, CheckCircle2, XCircle, FilePlus, Save, X } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [prescribeId, setPrescribeId] = useState(null)
  const [prescriptionText, setPrescriptionText] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return }
    api.get('/doctors/by-user/' + user.userId)
      .then(r => api.get('/appointments/doctor/' + r.data.doctorId))
      .then(a => { setAppointments(a.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const markComplete = async (id) => {
    await api.put('/appointments/' + id + '/complete')
    setAppointments(prev => prev.map(a => a.appointmentId === id ? { ...a, appointmentStatus: 'COMPLETED' } : a))
    flash('Marked as completed.')
  }

  const cancel = async (id) => {
    await api.put('/appointments/' + id + '/cancel')
    setAppointments(prev => prev.map(a => a.appointmentId === id ? { ...a, appointmentStatus: 'CANCELLED' } : a))
    flash('Appointment cancelled.')
  }

  const savePrescription = async (id) => {
    if (!prescriptionText.trim()) return
    await api.put('/appointments/' + id + '/prescription', { prescription: prescriptionText })
    setAppointments(prev => prev.map(a => a.appointmentId === id ? { ...a, prescription: prescriptionText } : a))
    setPrescribeId(null)
    setPrescriptionText('')
    flash('Prescription saved.')
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <button onClick={() => navigate('/doctor')} className="flex items-center gap-1.5 text-sm text-muted hover:text-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold text-text">My Appointments</h1>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-5 border bg-amber-50 text-amber-700 border-amber-100"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <Card className="p-6"><div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></Card>
      ) : appointments.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No appointments found" description="Appointments booked with you will appear here." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {['Patient', 'Date', 'Status', 'Remark', 'Prescription', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.appointmentId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.patient?.patientName || '?'} size="sm" />
                        <span className="text-[13.5px] font-medium text-text">{a.patient?.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted whitespace-nowrap">{a.appointmentDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.appointmentStatus} /></td>
                    <td className="px-4 py-3 text-[13px] text-muted">{a.remark || '—'}</td>
                    <td className="px-4 py-3 min-w-[180px]">
                      {a.prescription ? (
                        <span className="text-[12.5px] text-text italic">{a.prescription}</span>
                      ) : a.appointmentStatus === 'COMPLETED' ? (
                        prescribeId === a.appointmentId ? (
                          <div className="flex flex-col gap-2">
                            <Textarea rows={2} className="text-xs" value={prescriptionText} onChange={e => setPrescriptionText(e.target.value)} placeholder="Enter prescription…" />
                            <div className="flex gap-1.5">
                              <Button size="sm" onClick={() => savePrescription(a.appointmentId)}><Save className="w-3 h-3" /> Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setPrescribeId(null)}><X className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => { setPrescribeId(a.appointmentId); setPrescriptionText('') }}>
                            <FilePlus className="w-3.5 h-3.5" /> Add
                          </Button>
                        )
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {a.appointmentStatus === 'APPROVED' && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="success" onClick={() => markComplete(a.appointmentId)}><CheckCircle2 className="w-3.5 h-3.5" /> Complete</Button>
                          <Button size="sm" variant="danger" onClick={() => cancel(a.appointmentId)}><XCircle className="w-3.5 h-3.5" /> Cancel</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
