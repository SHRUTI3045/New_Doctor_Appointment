import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CalendarClock, Hash, FileText, Video, RotateCcw, XCircle, CalendarDays, Check } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [rescheduleId, setRescheduleId] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [msg, setMsg] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return }
    api.get('/patients/by-user/' + user.userId)
      .then(r => api.get('/appointments/patient/' + r.data.patientId))
      .then(a => { setAppointments(a.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const cancel = async (id) => {
    await api.put('/appointments/' + id + '/cancel')
    setAppointments(prev => prev.map(a => a.appointmentId === id ? { ...a, appointmentStatus: 'CANCELLED' } : a))
    flash('Appointment cancelled.')
  }

  const doReschedule = async (id) => {
    if (!rescheduleDate) return
    await api.put('/appointments/' + id + '/reschedule', { appointmentDate: rescheduleDate })
    setAppointments(prev => prev.map(a => a.appointmentId === id ? { ...a, appointmentDate: rescheduleDate, appointmentStatus: 'PENDING' } : a))
    setRescheduleId(null)
    flash('Rescheduled. Awaiting re-approval.')
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <button onClick={() => navigate('/patient')} className="flex items-center gap-1.5 text-sm text-muted hover:text-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>
      <div className="flex items-center gap-2 mb-6">
        <CalendarClock className="w-6 h-6 text-primary" />
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
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No appointments yet"
          description="Book your first appointment with a doctor to get started."
          action={<Link to="/patient/book"><Button>Book an Appointment</Button></Link>}
        />
      ) : (
        <div className="relative flex flex-col gap-5">
          {appointments.map((a, i) => (
            <motion.div
              key={a.appointmentId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative pl-6"
            >
              <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
              {i !== appointments.length - 1 && <span className="absolute left-[4.5px] top-4 w-px h-full bg-border" />}

              <Card gradient hover className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.doctor?.doctorName || '?'} size="md" />
                    <div>
                      <div className="font-bold text-[14.5px] text-text">Dr. {a.doctor?.doctorName}</div>
                      <div className="text-xs text-muted">{a.doctor?.speciality} · {a.doctor?.hospitalName}</div>
                    </div>
                  </div>
                  <StatusBadge status={a.appointmentStatus} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted mb-1 pl-[60px]">
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {a.appointmentDate}</span>
                  <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> {a.appointmentId}</span>
                  {a.remark && <span className="text-danger">Remark: {a.remark}</span>}
                </div>

                {a.prescription && (
                  <div className="mt-3 ml-[60px] flex items-start gap-2 bg-emerald-50 border-l-3 border-primary rounded-lg px-3.5 py-2.5 text-[13px] text-text">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="font-semibold">Prescription:</strong> {a.prescription}</span>
                  </div>
                )}

                <div className="ml-[60px] mt-3 flex items-center gap-2 text-muted">
                  <Video className="w-3.5 h-3.5" />
                  <span className="text-[12px] italic">Video call available for upcoming visits</span>
                </div>

                {['PENDING', 'APPROVED'].includes(a.appointmentStatus) && (
                  <div className="ml-[60px] mt-4 flex flex-wrap items-center gap-2">
                    {rescheduleId === a.appointmentId ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Input
                          type="date"
                          className="w-auto"
                          value={rescheduleDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setRescheduleDate(e.target.value)}
                        />
                        <Button size="sm" onClick={() => doReschedule(a.appointmentId)}><Check className="w-3.5 h-3.5" /> Confirm</Button>
                        <Button size="sm" variant="ghost" onClick={() => setRescheduleId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => { setRescheduleId(a.appointmentId); setRescheduleDate(a.appointmentDate) }}>
                          <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => cancel(a.appointmentId)}>
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
