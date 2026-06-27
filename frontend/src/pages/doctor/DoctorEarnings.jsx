import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function DoctorEarnings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return }
    api.get('/doctors/by-user/' + user.userId)
      .then(r => api.get('/doctors/' + r.data.doctorId + '/earnings'))
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading…</div>

  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={() => navigate('/doctor')}>← Dashboard</button>
      <h2 style={s.title}>My Earnings</h2>
      {!data ? (
        <p style={{ color: '#637082' }}>No earnings data available.</p>
      ) : (
        <>
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <div style={s.statVal}>₹{data.totalEarnings?.toLocaleString('en-IN')}</div>
              <div style={s.statLabel}>Total Earnings</div>
            </div>
            <div style={{ ...s.statCard, borderTopColor: '#166534' }}>
              <div style={{ ...s.statVal, color: '#166534' }}>{data.completedCount}</div>
              <div style={s.statLabel}>Completed Appointments</div>
            </div>
          </div>
          {data.appointments?.length > 0 && (
            <>
              <h3 style={s.subtitle}>Completed Appointments</h3>
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead><tr style={s.thead}>
                    <th style={s.th}>Patient</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Prescription</th>
                  </tr></thead>
                  <tbody>
                    {data.appointments.map(a => (
                      <tr key={a.appointmentId} style={s.tr}>
                        <td style={s.td}>{a.patient?.patientName}</td>
                        <td style={s.td}>{a.appointmentDate}</td>
                        <td style={s.td}>{a.prescription || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '860px', margin: '0 auto', padding: '40px 24px' },
  backBtn: { background: 'none', border: 'none', color: '#637082', cursor: 'pointer', fontSize: '13px', padding: '0 0 12px 0', display: 'block' },
  title: { margin: '0 0 24px', fontSize: '22px', fontWeight: 600 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' },
  statCard: { background: '#fff', border: '1px solid #d8e2ec', borderTop: '3px solid #0b7065', borderRadius: '6px', padding: '20px', textAlign: 'center' },
  statVal: { fontSize: '30px', fontWeight: 700, color: '#0b7065' },
  statLabel: { fontSize: '13px', color: '#637082', marginTop: '4px' },
  subtitle: { margin: '0 0 14px', fontSize: '16px', fontWeight: 600 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '12px 16px', fontSize: '13.5px' },
}
