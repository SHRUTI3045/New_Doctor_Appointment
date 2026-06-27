import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0 })

  useEffect(() => {
    if (!user?.userId) return
    api.get(`/patients/by-user/${user.userId}`)
      .then(r => {
        const patientId = r.data.patientId
        return api.get(`/appointments/patient/${patientId}`)
      })
      .then(r => {
        const appts = r.data || []
        setStats({
          upcoming: appts.filter(a => a.appointmentStatus === 'APPROVED').length,
          pending: appts.filter(a => a.appointmentStatus === 'PENDING').length,
          completed: appts.filter(a => a.appointmentStatus === 'COMPLETED').length,
        })
      })
      .catch(() => {})
  }, [user])

  const cards = [
    { title: 'Book Appointment', desc: 'Schedule a visit with a doctor', to: '/patient/book', color: '#0b7065' },
    { title: 'My Appointments', desc: 'View and track appointment status', to: '/patient/appointments', color: '#1e3a5f' },
    { title: 'Give Feedback', desc: 'Rate your doctor experience', to: '/patient/feedback', color: '#6b21a8' },
    { title: 'Update Profile', desc: 'Edit your personal information', to: '/patient/profile', color: '#dc2626' },
  ]

  const statItems = [
    { label: 'Upcoming', value: stats.upcoming, color: '#1e3a5f' },
    { label: 'Awaiting Approval', value: stats.pending, color: '#d97706' },
    { label: 'Completed', value: stats.completed, color: '#0b7065' },
  ]

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.h1}>Welcome, {user?.userName}</h1>
        <p style={s.sub}>Patient Portal</p>
      </div>
      <div style={s.statsRow}>
        {statItems.map(item => (
          <div key={item.label} style={{ ...s.statBadge, borderLeft: `3px solid ${item.color}` }}>
            <span style={s.statNum}>{item.value}</span>
            <span style={s.statLabel}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={s.grid}>
        {cards.map(c => (
          <Link to={c.to} key={c.to} style={{ ...s.card, borderTopColor: c.color }}>
            <div style={{ ...s.cardIcon, background: c.color + '15', color: c.color }}>
              {c.title[0]}
            </div>
            <div style={s.cardTitle}>{c.title}</div>
            <div style={s.cardDesc}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '24px' },
  h1: { margin: 0, fontSize: '26px', fontWeight: 600 },
  sub: { margin: '4px 0 0', color: '#637082', fontSize: '14px' },
  statsRow: { display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  statBadge: { display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '12px 18px' },
  statNum: { fontSize: '24px', fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: '12px', color: '#637082' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderTop: '3px solid', borderRadius: '6px', padding: '24px', display: 'block', transition: 'box-shadow 0.15s' },
  cardIcon: { width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', marginBottom: '14px' },
  cardTitle: { fontWeight: 600, fontSize: '15px', marginBottom: '6px' },
  cardDesc: { color: '#637082', fontSize: '13.5px' },
}
