import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function SubmitFeedback() {
  const [doctors, setDoctors] = useState([])
  const [patientId, setPatientId] = useState(null)
  const [form, setForm] = useState({ doctorId: '', rating: 5, feedbackComment: '' })
  const [msg, setMsg] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    api.get('/doctors/list').then(r => setDoctors(r.data))
    if (user?.userId) {
      api.get(`/patients/by-user/${user.userId}`).then(r => setPatientId(r.data.patientId)).catch(() => {})
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) { setMsg('Patient profile not found.'); return }
    try {
      await api.post('/feedback', {
        patient: { patientId },
        doctor: { doctorId: Number(form.doctorId) },
        rating: form.rating,
        feedbackComment: form.feedbackComment,
      })
      setMsg('Feedback submitted successfully!')
      setForm({ doctorId: '', rating: 5, feedbackComment: '' })
    } catch {
      setMsg('Failed to submit feedback.')
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Submit Feedback</h2>
        <p style={s.sub}>Share your experience with your doctor</p>
        {msg && <div style={msg.includes('success') ? s.success : s.error}>{msg}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Doctor</label>
          <select style={s.input} value={form.doctorId}
            onChange={e => setForm(p => ({...p, doctorId: e.target.value}))} required>
            <option value="">Select a doctor</option>
            {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>Dr. {d.doctorName} — {d.speciality}</option>)}
          </select>

          <label style={s.label}>Rating</label>
          <div style={s.stars}>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                style={{ ...s.star, color: n <= form.rating ? '#f59e0b' : '#d1d5db' }}
                onClick={() => setForm(p => ({...p, rating: n}))}>★</button>
            ))}
            <span style={s.ratingLabel}>{form.rating} / 5</span>
          </div>

          <label style={s.label}>Comment</label>
          <textarea style={s.textarea} rows={4}
            value={form.feedbackComment}
            onChange={e => setForm(p => ({...p, feedbackComment: e.target.value}))}
            placeholder="Describe your experience…" />

          <button style={s.btn} type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '480px' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 600 },
  sub: { margin: '0 0 24px', color: '#637082', fontSize: '14px' },
  success: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', fontWeight: 500, color: '#374151', marginTop: '14px', marginBottom: '5px' },
  input: { padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px', width: '100%' },
  stars: { display: 'flex', alignItems: 'center', gap: '4px' },
  star: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', padding: '0', lineHeight: 1 },
  ratingLabel: { marginLeft: '8px', fontSize: '13px', color: '#637082' },
  textarea: { padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' },
  btn: { marginTop: '20px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
}
