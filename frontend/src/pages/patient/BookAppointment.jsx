import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Search, MapPin, IndianRupee, BadgeCheck, X, Building2,
  Phone, Mail, CalendarDays, Stethoscope, CheckCircle2,
} from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { StarRating } from '../../components/ui/Rating'
import { EmptyState } from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'

function DoctorModal({ doc, ratings, onBook, onClose }) {
  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-xl shadow-card-hover w-full max-w-md max-h-[85vh] overflow-y-auto"
          >
            <div className="h-20 bg-gradient-to-r from-primary via-primary to-accent relative">
              <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-7 pb-7 -mt-8">
              <Avatar name={doc.doctorName} size="lg" className="ring-4 ring-white" />
              <div className="flex items-center gap-1.5 mt-3">
                <h3 className="text-lg font-extrabold text-text">Dr. {doc.doctorName}</h3>
                <BadgeCheck className="w-4.5 h-4.5 text-primary" />
              </div>
              <p className="text-sm text-muted mb-3">{doc.speciality}</p>
              {ratings[doc.doctorId] && <StarRating value={Number(ratings[doc.doctorId].avg)} count={ratings[doc.doctorId].count} className="mb-4" />}

              <div className="flex flex-col gap-3 text-sm mb-6">
                <InfoRow icon={Building2} label="Hospital" value={doc.hospitalName} />
                <InfoRow icon={MapPin} label="Location" value={doc.location} />
                <InfoRow icon={Phone} label="Mobile" value={doc.mobileNo} />
                <InfoRow icon={Mail} label="Email" value={doc.email} />
                <InfoRow icon={IndianRupee} label="Fee per Visit" value={doc.chargedPerVisit ? `₹${doc.chargedPerVisit}` : null} />
              </div>

              <Button size="lg" className="w-full" onClick={onBook}>Book with this Doctor</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted" />
      </span>
      <div>
        <div className="text-[11px] text-muted uppercase tracking-wide font-semibold">{label}</div>
        <div className="text-[13.5px] text-text font-medium">{value}</div>
      </div>
    </div>
  )
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [specialities, setSpecialities] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [ratings, setRatings] = useState({})
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '' })
  const [patientId, setPatientId] = useState(null)
  const [msg, setMsg] = useState('')
  const [modalDoc, setModalDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/doctors/list').then(r => {
      setDoctors(r.data)
      setLoading(false)
      const specs = [...new Set(r.data.map(d => d.speciality).filter(Boolean))]
      setSpecialities(specs)
      Promise.all(r.data.map(d =>
        api.get('/feedback/doctor/' + d.doctorId)
          .then(fb => ({
            id: d.doctorId,
            avg: fb.data.length ? (fb.data.reduce((sum, f) => sum + f.rating, 0) / fb.data.length).toFixed(1) : null,
            count: fb.data.length,
          }))
          .catch(() => ({ id: d.doctorId, avg: null, count: 0 }))
      )).then(rs => {
        const map = {}
        rs.forEach(r => { if (r.avg) map[r.id] = { avg: r.avg, count: r.count } })
        setRatings(map)
      })
    })
    if (user?.userId) {
      api.get(`/patients/by-user/${user.userId}`).then(r => setPatientId(r.data.patientId)).catch(() => {})
    }
  }, [user])

  const filtered = doctors.filter(d =>
    (!filter || d.speciality === filter) &&
    (!search || d.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                (d.location && d.location.toLowerCase().includes(search.toLowerCase())))
  )

  const selectedDoctor = doctors.find(d => d.doctorId == form.doctorId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) { setMsg('Patient profile not found. Contact admin.'); return }
    try {
      await api.post('/appointments', {
        patient: { patientId },
        doctor: { doctorId: Number(form.doctorId) },
        appointmentDate: form.appointmentDate,
      })
      setMsg('success:Appointment booked successfully! Awaiting approval.')
      setTimeout(() => navigate('/patient/appointments'), 1800)
    } catch {
      setMsg('error:Failed to book appointment.')
    }
  }

  const isSuccess = msg.startsWith('success:')
  const msgText = msg.replace(/^(success|error):/, '')

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="flex items-center gap-2 mb-6">
        <Stethoscope className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold text-text">Book Appointment</h1>
      </div>

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

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <Input
              icon={Search}
              placeholder="Search by name or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <Chip active={!filter} onClick={() => setFilter('')}>All</Chip>
              {specialities.map(sp => (
                <Chip key={sp} active={filter === sp} onClick={() => setFilter(sp)}>{sp}</Chip>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Stethoscope} title="No doctors found" description="Try adjusting your search or filters." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((doc, i) => {
                const selected = form.doctorId == doc.doctorId
                const rating = ratings[doc.doctorId]
                return (
                  <motion.div
                    key={doc.doctorId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                  >
                    <Card
                      gradient
                      className={`p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${selected ? 'ring-2 ring-primary shadow-glow' : ''}`}
                      onClick={() => setForm(p => ({ ...p, doctorId: doc.doctorId }))}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar name={doc.doctorName} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-[14.5px] text-text truncate">Dr. {doc.doctorName}</h3>
                            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted">{doc.speciality}</p>
                        </div>
                      </div>

                      {rating && <StarRating value={Number(rating.avg)} count={rating.count} className="mb-2.5" />}

                      <div className="flex flex-col gap-1.5 text-[12.5px] text-muted mb-4">
                        <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {doc.hospitalName}</span>
                        {doc.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {doc.location}</span>}
                        <span className="flex items-center gap-1.5 text-primary font-semibold"><IndianRupee className="w-3.5 h-3.5" /> {doc.chargedPerVisit} per visit</span>
                      </div>

                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <Button size="sm" className="flex-1" onClick={() => setForm(p => ({ ...p, doctorId: doc.doctorId }))}>
                          Book Appointment
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setModalDoc(doc)}>View Profile</Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <Card gradient className="p-6">
            <h3 className="font-bold text-[15px] text-text mb-4">Appointment Details</h3>
            {selectedDoctor ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-5">
                <Avatar name={selectedDoctor.doctorName} size="sm" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text truncate">Dr. {selectedDoctor.doctorName}</div>
                  <div className="text-xs text-muted truncate">{selectedDoctor.hospitalName}</div>
                  <div className="text-xs text-primary font-semibold">₹{selectedDoctor.chargedPerVisit} per visit</div>
                </div>
              </motion.div>
            ) : (
              <div className="text-sm text-muted bg-slate-50 rounded-xl p-4 text-center mb-5">Select a doctor to continue</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 mb-1">Appointment Date</label>
              <Input
                icon={CalendarDays}
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.appointmentDate}
                onChange={e => setForm(p => ({ ...p, appointmentDate: e.target.value }))}
              />
              <Button type="submit" size="lg" className="w-full mt-4" disabled={!form.doctorId}>
                Book Appointment
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <DoctorModal
        doc={modalDoc}
        ratings={ratings}
        onBook={() => { setForm(p => ({ ...p, doctorId: modalDoc.doctorId })); setModalDoc(null) }}
        onClose={() => setModalDoc(null)}
      />
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
        active ? 'bg-primary text-white border-primary shadow-soft' : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
      }`}
    >
      {children}
    </button>
  )
}
