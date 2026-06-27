import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

function BarChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null
  const items = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(...items.map(([, v]) => v), 1)
  const colors = { PENDING: '#f59e0b', APPROVED: '#10b981', COMPLETED: '#0b7065', REJECTED: '#ef4444', CANCELLED: '#9ca3af' }
  return (
    <div style={sc.box}>
      <h3 style={sc.title}>Appointments by Status</h3>
      {items.map(([status, count]) => (
        <div key={status} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{status}</span>
            <span style={{ fontSize: '12px', color: '#637082' }}>{count}</span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: colors[status] || '#9ca3af', borderRadius: '4px', width: (count / max * 100) + '%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, pending: 0 })
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    Promise.all([
      api.get('/patients'),
      api.get('/doctors/list'),
      api.get('/appointments'),
      api.get('/admin/stats').catch(() => ({ data: {} })),
    ]).then(([p, d, a, st]) => {
      setStats({
        patients: p.data.length,
        doctors: d.data.length,
        appointments: a.data.length,
        pending: a.data.filter(x => x.appointmentStatus === 'PENDING').length,
      })
      if (st.data?.byStatus) setChartData(st.data.byStatus)
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Patients', value: stats.patients, color: '#0b7065', to: '/admin/patients' },
    { label: 'Total Doctors', value: stats.doctors, color: '#1e3a5f', to: '/admin/doctors' },
    { label: 'Appointments', value: stats.appointments, color: '#6b21a8', to: '/admin/appointments' },
    { label: 'Pending Approval', value: stats.pending, color: '#d97706', to: '/admin/appointments' },
  ]

  const navItems = [
    { title: 'Manage Patients', desc: 'Add, edit, remove patients', to: '/admin/patients' },
    { title: 'Manage Doctors', desc: 'Add, edit, remove doctors', to: '/admin/doctors' },
    { title: 'Manage Appointments', desc: 'Approve, reject, view all', to: '/admin/appointments' },
  ]

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Admin Dashboard</h1>
      <div style={s.statGrid}>
        {cards.map(c => (
          <Link to={c.to} key={c.label} style={{ ...s.stat, borderTopColor: c.color }}>
            <div style={{ ...s.statVal, color: c.color }}>{c.value}</div>
            <div style={s.statLabel}>{c.label}</div>
          </Link>
        ))}
      </div>
      <BarChart data={chartData} />
      <h2 style={s.h2}>Quick Access</h2>
      <div style={s.navGrid}>
        {navItems.map(n => (
          <Link to={n.to} key={n.to} style={s.navCard}>
            <div style={s.navTitle}>{n.title}</div>
            <div style={s.navDesc}>{n.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' },
  h1: { margin: '0 0 24px', fontSize: '26px', fontWeight: 600 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' },
  stat: { background: '#fff', border: '1px solid #d8e2ec', borderTop: '3px solid', borderRadius: '6px', padding: '20px', display: 'block' },
  statVal: { fontSize: '32px', fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#637082', marginTop: '6px' },
  h2: { margin: '0 0 16px', fontSize: '18px', fontWeight: 600 },
  navGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' },
  navCard: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '20px', display: 'block' },
  navTitle: { fontWeight: 600, fontSize: '15px', marginBottom: '4px' },
  navDesc: { color: '#637082', fontSize: '13.5px' },
}
const sc = {
  box: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '20px', marginBottom: '32px' },
  title: { margin: '0 0 18px', fontSize: '15px', fontWeight: 600 },
}
