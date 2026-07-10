import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquareHeart, CheckCircle2, Stethoscope } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Select, Textarea, Label } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { StarRating } from '../../components/ui/Rating'
import { EmptyState } from '../../components/ui/EmptyState'

const REACTIONS = [
  { rating: 1, emoji: '😞', label: 'Poor' },
  { rating: 2, emoji: '😕', label: 'Fair' },
  { rating: 3, emoji: '😐', label: 'Okay' },
  { rating: 4, emoji: '🙂', label: 'Good' },
  { rating: 5, emoji: '🤩', label: 'Excellent' },
]

const MAX_CHARS = 500

export default function SubmitFeedback() {
  const [doctors, setDoctors] = useState([])
  const [patientId, setPatientId] = useState(null)
  const [form, setForm] = useState({ doctorId: '', rating: 5, feedbackComment: '' })
  const [msg, setMsg] = useState('')
  const [reviews, setReviews] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    api.get('/doctors/list').then(r => setDoctors(r.data))
    if (user?.userId) {
      api.get(`/patients/by-user/${user.userId}`).then(r => setPatientId(r.data.patientId)).catch(() => {})
    }
  }, [user])

  useEffect(() => {
    if (!form.doctorId) { setReviews([]); return }
    api.get('/feedback/doctor/' + form.doctorId).then(r => setReviews(r.data)).catch(() => setReviews([]))
  }, [form.doctorId])

  const selectedDoctor = doctors.find(d => d.doctorId == form.doctorId)
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) { setMsg('error:Patient profile not found.'); return }
    try {
      await api.post('/feedback', {
        patient: { patientId },
        doctor: { doctorId: Number(form.doctorId) },
        rating: form.rating,
        feedbackComment: form.feedbackComment,
      })
      setMsg('success:Feedback submitted successfully!')
      const doctorId = form.doctorId
      setForm({ doctorId: '', rating: 5, feedbackComment: '' })
      api.get('/feedback/doctor/' + doctorId).then(r => setReviews(r.data)).catch(() => {})
    } catch {
      setMsg('error:Failed to submit feedback.')
    }
  }

  const isSuccess = msg.startsWith('success:')
  const msgText = msg.replace(/^(success|error):/, '')

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquareHeart className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold text-text">Submit Feedback</h1>
      </div>

      <Card gradient className="p-7 sm:p-8 mb-8">
        <p className="text-sm text-muted mb-6">Share your experience with your doctor — it helps other patients choose with confidence.</p>

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label>Doctor</Label>
            <Select icon={Stethoscope} value={form.doctorId} onChange={e => setForm(p => ({ ...p, doctorId: e.target.value }))} required>
              <option value="">Select a doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>Dr. {d.doctorName} — {d.speciality}</option>)}
            </Select>
            {selectedDoctor && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mt-3 bg-slate-50 rounded-xl p-3">
                <Avatar name={selectedDoctor.doctorName} size="sm" />
                <div>
                  <div className="text-[13px] font-semibold text-text">Dr. {selectedDoctor.doctorName}</div>
                  <div className="text-xs text-muted">{selectedDoctor.hospitalName}</div>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <Label>How was your experience?</Label>
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
              {REACTIONS.map(r => (
                <button
                  key={r.rating}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, rating: r.rating }))}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 ${form.rating === r.rating ? 'bg-white shadow-soft scale-110' : 'opacity-50 hover:opacity-100'}`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-[10px] font-medium text-muted">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))} className="transition-transform duration-150 hover:scale-125">
                  <Star className="w-7 h-7" fill={n <= form.rating ? '#F59E0B' : 'none'} stroke={n <= form.rating ? '#F59E0B' : '#CBD5E1'} strokeWidth={1.75} />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-text">{form.rating} / 5</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="mb-0">Comment</Label>
              <span className="text-xs text-muted">{form.feedbackComment.length}/{MAX_CHARS}</span>
            </div>
            <Textarea
              rows={4}
              maxLength={MAX_CHARS}
              value={form.feedbackComment}
              onChange={e => setForm(p => ({ ...p, feedbackComment: e.target.value }))}
              placeholder="Describe your experience…"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">Submit Feedback</Button>
        </form>
      </Card>

      <h2 className="text-base font-bold text-text mb-4 flex items-center gap-2">
        Previous Reviews
        {avgRating && <StarRating value={Number(avgRating)} count={reviews.length} />}
      </h2>

      {!form.doctorId ? (
        <p className="text-sm text-muted">Select a doctor above to see their reviews.</p>
      ) : reviews.length === 0 ? (
        <EmptyState icon={MessageSquareHeart} title="No reviews yet" description="Be the first to review this doctor." />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.feedbackId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card className="p-4 flex gap-3">
                <Avatar name={r.patient?.patientName || 'Patient'} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13.5px] font-semibold text-text">{r.patient?.patientName || 'Anonymous'}</span>
                    <StarRating value={r.rating} />
                  </div>
                  {r.feedbackComment && <p className="text-[13px] text-muted leading-relaxed">{r.feedbackComment}</p>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
