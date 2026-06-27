import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  const dashboardPath = user?.role === 'ADMIN' ? '/admin'
    : user?.role === 'DOCTOR' ? '/doctor'
    : user ? '/patient' : '/'

  const patientLinks = [
    { to: '/patient/book', label: 'Book' },
    { to: '/patient/appointments', label: 'My Appointments' },
    { to: '/patient/feedback', label: 'Feedback' },
    { to: '/patient/profile', label: 'Profile' },
  ]
  const doctorLinks = [
    { to: '/doctor/appointments', label: 'Appointments' },
    { to: '/doctor/patients', label: 'Patients' },
    { to: '/doctor/earnings', label: 'Earnings' },
  ]
  const adminLinks = [
    { to: '/admin/appointments', label: 'Appointments' },
    { to: '/admin/doctors', label: 'Doctors' },
    { to: '/admin/patients', label: 'Patients' },
  ]

  const links = user?.role === 'ADMIN' ? adminLinks
    : user?.role === 'DOCTOR' ? doctorLinks
    : user ? patientLinks : []

  return (
    <nav style={st.nav}>
      <div style={st.left}>
        <Link to={dashboardPath} style={st.brand}>MediBook</Link>
        {user && links.map(l => (
          <Link key={l.to} to={l.to}
            style={{ ...st.navLink, ...(location.pathname.startsWith(l.to) ? st.active : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={st.right}>
        {user ? (
          <>
            <span style={st.userInfo}>{user.userName} · {user.role}</span>
            <button onClick={handleLogout} style={st.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={st.link}>Login</Link>
            <Link to="/register" style={st.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const st = {
  nav: { background: '#0f2438', color: 'white', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  left: { display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden' },
  brand: { color: '#1a9c8f', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', marginRight: '14px', flexShrink: 0 },
  navLink: { color: '#8ba3b8', fontSize: '13px', padding: '5px 10px', borderRadius: '4px', whiteSpace: 'nowrap' },
  active: { background: '#1a3450', color: '#e2e8f0' },
  right: { display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 },
  link: { color: '#8ba3b8', fontSize: '14px' },
  userInfo: { color: '#8ba3b8', fontSize: '13px' },
  logoutBtn: { background: 'transparent', border: '1px solid #344f68', color: '#8ba3b8', padding: '5px 14px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' },
  registerBtn: { background: '#0b7065', color: 'white', padding: '5px 14px', borderRadius: '4px', fontSize: '13px' },
}
