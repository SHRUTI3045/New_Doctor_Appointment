import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const cards = [
    { title: 'My Appointments', desc: 'View and manage all your appointments', to: '/doctor/appointments', color: '#0b7065' },
    { title: 'My Patients', desc: 'View list of assigned patients', to: '/doctor/patients', color: '#1e3a5f' },
  ]
  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.h1}>Doctor Dashboard</h1>
        <p style={s.sub}>Welcome, {user?.userName}</p>
      </div>
      <div style={s.grid}>
        {cards.map(c => (
          <Link to={c.to} key={c.to} style={{ ...s.card, borderTopColor: c.color }}>
            <div style={{ ...s.icon, background: c.color + '15', color: c.color }}>{c.title[0]}</div>
            <div style={s.cardTitle}>{c.title}</div>
            <div style={s.cardDesc}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '760px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '32px' },
  h1: { margin: 0, fontSize: '26px', fontWeight: 600 },
  sub: { margin: '4px 0 0', color: '#637082', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderTop: '3px solid', borderRadius: '6px', padding: '24px', display: 'block' },
  icon: { width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', marginBottom: '14px' },
  cardTitle: { fontWeight: 600, fontSize: '15px', marginBottom: '6px' },
  cardDesc: { color: '#637082', fontSize: '13.5px' },
}
