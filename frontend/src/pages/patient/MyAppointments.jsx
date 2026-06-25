import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const STATUS_STYLE = {
  PENDING:   { background: '#fef3c7', color: '#92400e' },
  APPROVED:  { background: '#d1fae5', color: '#065f46' },
  REJECTED:  { background: '#fee2e2', color: '#991b1b' },
  CANCELLED: { background: '#f3f4f6', color: '#6b7280' },
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/patients').then(r => {
      const p = r.data.find(p =>
        p.email?.toLowerCase() === user?.userName?.toLowerCase() ||
        p.patientName?.toLowerCase().includes(user?.userName?.toLowerCase()))
      if (p) {
        api.get(`/appointments/patient/${p.patientId}`).then(a => {
          setAppointments(a.data)
          setLoading(false)
        })
      } else setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  return (
    <div style={s.page}>
      <h2 style={s.title}>My Appointments</h2>
      {loading ? <p>Loading…</p> : appointments.length === 0 ? (
        <div style={s.empty}>No appointments found. <a href="/patient/book" style={s.link}>Book one now.</a></div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '40px 24px' },
  title: { margin: '0 0 24px', fontSize: '22px', fontWeight: 600 },
  empty: { color: '#637082', padding: '32px 0' },
  link: { color: '#0b7065' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '18px 20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  docName: { fontWeight: 600, fontSize: '15px' },
  docSpec: { color: '#637082', fontSize: '13px', marginTop: '2px' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.05em' },
  cardMeta: { display: 'flex', gap: '20px', fontSize: '13.5px', color: '#374151' },
  remark: { color: '#991b1b' },
}
