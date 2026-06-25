import { useState, useEffect } from 'react'
import api from '../../api/axios'

const STATUS_STYLE = {
  PENDING:   { background: '#fef3c7', color: '#92400e' },
  APPROVED:  { background: '#d1fae5', color: '#065f46' },
  REJECTED:  { background: '#fee2e2', color: '#991b1b' },
  CANCELLED: { background: '#f3f4f6', color: '#6b7280' },
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [msg, setMsg] = useState('')

  const load = () => api.get('/appointments').then(r => setAppointments(r.data))
  useEffect(() => { load() }, [])

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const approve = async (id) => {
    await api.put(`/appointments/${id}/approve`)
    flash('Appointment approved.'); load()
  }
  const reject = async (id) => {
    await api.put(`/appointments/${id}/reject`, { remark: 'Rejected by admin' })
    flash('Appointment rejected.'); load()
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.appointmentStatus === filter)

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <h2 style={s.title}>Manage Appointments</h2>
        <div style={s.filters}>
          {['ALL','PENDING','APPROVED','REJECTED','CANCELLED'].map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      {msg && <div style={s.info}>{msg}</div>}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            {['ID','Patient','Doctor','Date','Status','Remark','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.appointmentId} style={s.tr}>
                <td style={s.td}>#{a.appointmentId}</td>
                <td style={s.td}>{a.patient?.patientName}</td>
                <td style={s.td}>Dr. {a.doctor?.doctorName}<br/><span style={s.spec}>{a.doctor?.speciality}</span></td>
                <td style={s.td}>{a.appointmentDate}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...STATUS_STYLE[a.appointmentStatus] }}>
                    {a.appointmentStatus}
                  </span>
                </td>
                <td style={s.td}>{a.remark || '—'}</td>
                <td style={s.td}>
                  {a.appointmentStatus === 'PENDING' && (
                    <>
                      <button style={s.approveBtn} onClick={() => approve(a.appointmentId)}>Approve</button>
                      <button style={s.rejectBtn} onClick={() => reject(a.appointmentId)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={s.empty}>No appointments found.</p>}
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { margin: 0, fontSize: '22px', fontWeight: 600 },
  filters: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: { padding: '5px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', background: '#fff', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#637082' },
  filterActive: { background: '#0b7065', color: 'white', borderColor: '#0b7065' },
  info: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '11px 14px', fontSize: '13.5px', verticalAlign: 'top' },
  spec: { fontSize: '12px', color: '#637082' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' },
  approveBtn: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' },
  rejectBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '24px', color: '#637082', fontSize: '14px' },
}
