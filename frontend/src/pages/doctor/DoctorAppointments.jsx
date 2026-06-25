import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const STATUS_STYLE = {
  PENDING:   { background: '#fef3c7', color: '#92400e' },
  APPROVED:  { background: '#d1fae5', color: '#065f46' },
  REJECTED:  { background: '#fee2e2', color: '#991b1b' },
  CANCELLED: { background: '#f3f4f6', color: '#6b7280' },
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [doctorId, setDoctorId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    api.get('/doctors/list').then(r => {
      const d = r.data.find(d =>
        d.doctorName?.toLowerCase().includes(user?.userName?.toLowerCase()) ||
        d.email?.toLowerCase() === user?.userName?.toLowerCase())
      if (d) {
        setDoctorId(d.doctorId)
        api.get(`/appointments/doctor/${d.doctorId}`).then(a => {
          setAppointments(a.data)
          setLoading(false)
        })
      } else setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const cancel = async (id) => {
    await api.put(`/appointments/${id}/cancel`)
    setAppointments(prev => prev.map(a =>
      a.appointmentId === id ? { ...a, appointmentStatus: 'CANCELLED' } : a))
    setMsg('Appointment cancelled.')
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>My Appointments</h2>
      {msg && <div style={s.info}>{msg}</div>}
      {loading ? <p>Loading…</p> : appointments.length === 0 ? (
        <p style={{ color: '#637082' }}>No appointments found.</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Patient</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Remark</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.appointmentId} style={s.tr}>
                  <td style={s.td}>{a.patient?.patientName}</td>
                  <td style={s.td}>{a.appointmentDate}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...STATUS_STYLE[a.appointmentStatus] }}>
                      {a.appointmentStatus}
                    </span>
                  </td>
                  <td style={s.td}>{a.remark || '—'}</td>
                  <td style={s.td}>
                    {a.appointmentStatus === 'APPROVED' && (
                      <button style={s.cancelBtn} onClick={() => cancel(a.appointmentId)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  title: { margin: '0 0 20px', fontSize: '22px', fontWeight: 600 },
  info: { background: '#fef3c7', color: '#92400e', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '12px 16px', fontSize: '13.5px' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' },
  cancelBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
}
