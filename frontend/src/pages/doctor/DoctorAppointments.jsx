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
    <div style={s.page}>
      <button style={s.backBtn} onClick={() => navigate('/doctor')}>← Dashboard</button>
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
                <th style={s.th}>Prescription</th>
                <th style={s.th}>Actions</th>
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
                    {a.prescription ? (
                      <span style={s.rxText}>{a.prescription}</span>
                    ) : a.appointmentStatus === 'COMPLETED' ? (
                      prescribeId === a.appointmentId ? (
                        <div style={s.rxForm}>
                          <textarea style={s.rxArea} rows={2} value={prescriptionText}
                            onChange={e => setPrescriptionText(e.target.value)}
                            placeholder="Enter prescription…" />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button style={s.saveBtn} onClick={() => savePrescription(a.appointmentId)}>Save</button>
                            <button style={s.skipBtn} onClick={() => setPrescribeId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button style={s.addRxBtn} onClick={() => { setPrescribeId(a.appointmentId); setPrescriptionText('') }}>+ Add</button>
                      )
                    ) : '—'}
                  </td>
                  <td style={s.td}>
                    {a.appointmentStatus === 'APPROVED' && (
                      <>
                        <button style={s.completeBtn} onClick={() => markComplete(a.appointmentId)}>✓ Complete</button>
                        <button style={s.cancelBtn} onClick={() => cancel(a.appointmentId)}>Cancel</button>
                      </>
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
  page: { maxWidth: '1050px', margin: '0 auto', padding: '40px 24px' },
  backBtn: { background: 'none', border: 'none', color: '#637082', cursor: 'pointer', fontSize: '13px', padding: '0 0 12px 0', display: 'block' },
  title: { margin: '0 0 20px', fontSize: '22px', fontWeight: 600 },
  info: { background: '#fef3c7', color: '#92400e', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '11px 14px', fontSize: '13.5px', verticalAlign: 'top' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' },
  completeBtn: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' },
  cancelBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  addRxBtn: { background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  rxForm: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' },
  rxArea: { padding: '6px 8px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '12px', resize: 'vertical', fontFamily: 'inherit' },
  saveBtn: { background: '#0b7065', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  skipBtn: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  rxText: { fontSize: '12px', color: '#374151', fontStyle: 'italic', maxWidth: '160px', display: 'block' },
}
