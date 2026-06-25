import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardPath = () => {
    if (!user) return '/'
    if (user.role === 'ADMIN') return '/admin'
    if (user.role === 'DOCTOR') return '/doctor'
    return '/patient'
  }

  return (
    <nav style={styles.nav}>
      <Link to={dashboardPath()} style={styles.brand}>
        MediBook
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.userInfo}>{user.userName} · {user.role}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: '#0f2438',
    color: 'white',
    padding: '0 32px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#1a9c8f',
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '-0.02em',
  },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: '#8ba3b8', fontSize: '14px' },
  userInfo: { color: '#8ba3b8', fontSize: '13px' },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #344f68',
    color: '#8ba3b8',
    padding: '5px 14px',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  registerBtn: {
    background: '#0b7065',
    color: 'white',
    padding: '5px 14px',
    borderRadius: '4px',
    fontSize: '13px',
  },
}
