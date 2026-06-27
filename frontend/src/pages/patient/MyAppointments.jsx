import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const STATUS_STYLE = {
  PENDING:   { background: '#fef3c7', color: '#92400e' },
  APPROVED:  { background: '#d1fae5', color: '#065f46' },
  REJECTED:  { background: '#fee2e2', color: '#991b1b' },
  CANCELLED: { background: '#f3f4f6', color: '#6b7280' },
  COMPLETED: { background: '#dcfce7', color: '#166534' },
}

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
    <div style={s.page}>
      <button style={s.backBtn} onClick={() => navigate('/patient')}>← Dashboard</button>
      <h2 style={s.title}>My Appointments</h2>
      {msg && <div style={s.info}>{msg}</div>}
      {loading ? <p>Loading…</p> : appointments.length === 0 ? (
        <div style={s.empty}>No appointments yet. <a href="/patient/book" style={s.link}>Book one now.</a></div>
      ) : (
        <div style={s.list}>
          {appointments.map(a => (
            <div key={a.appointmentId} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <div style={s.docName}>Dr. {a.doctor?.doctorName}</div>
                  <div style={s.docSpec}>{a.doctor?.speciality} · {a.doctor?.hospitalName}</div>
                </div>
                <span style={{ ...s.badge, ...STATUS_STYLE[a.appointmentStatus] }}>
                  {a.appointmentStatus}
                </span>
              </div>
              <div style={s.cardMeta}>
                <span>Date: <strong>{a.appointmentDate}</strong></span>
                {a.remark && <span style={s.remark}>Remark: {a.remark}</span>}
              </div>
              {a.prescription && (
                <div style={s.prescription}>
                  <strong>Prescription:</strong> {a.prescription}
                </div>
              )}
              {['PENDING', 'APPROVED'].includes(a.appointmentStatus) && (
                <div style={s.actions}>
                  {rescheduleId === a.appointmentId ? (
                    <div style={s.rescheduleForm}>
                      <input type="date" style={s.dateInput} value={rescheduleDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setRescheduleDate(e.target.value)} />
                      <button style={s.confirmBtn} onClick={() => doReschedule(a.appointmentId)}>Confirm</button>
                      <button style={s.cancelFormBtn} onClick={() => setRescheduleId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <button style={s.rescheduleBtn} onClick={() => { setRescheduleId(a.appointmentId); setRescheduleDate(a.appointmentDate) }}>
                        Reschedule
                      </button>
                      <button style={s.cancelBtn} onClick={() => cancel(a.appointmentId)}>Cancel</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '40px 24px' },
  backBtn: { background: 'none', border: 'none', color: '#637082', cursor: 'pointer', fontSize: '13px', padding: '0 0 12px 0', display: 'block' },
  title: { margin: '0 0 24px', fontSize: '22px', fontWeight: 600 },
  info: { background: '#fef3c7', color: '#92400e', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  empty: { color: '#637082', padding: '32px 0' },
  link: { color: '#0b7065' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '18px 20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  docName: { fontWeight: 600, fontSize: '15px' },
  docSpec: { color: '#637082', fontSize: '13px', marginTop: '2px' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  cardMeta: { display: 'flex', gap: '20px', fontSize: '13.5px', color: '#374151', marginBottom: '8px' },
  remark: { color: '#991b1b' },
  prescription: { marginTop: '8px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '4px', fontSize: '13.5px', color: '#374151', borderLeft: '3px solid #0b7065' },
  actions: { marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' },
  rescheduleForm: { display: 'flex', gap: '8px', alignItems: 'center' },
  dateInput: { padding: '6px 10px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px' },
  confirmBtn: { background: '#0b7065', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  cancelFormBtn: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  rescheduleBtn: { background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
}
