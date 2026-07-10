import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse, CalendarPlus, CalendarClock, MessageSquareHeart, UserCircle,
  ClipboardList, Users, Wallet, Stethoscope, Bell, LogOut, Menu, X, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }

  const dashboardPath = user?.role === 'ADMIN' ? '/admin'
    : user?.role === 'DOCTOR' ? '/doctor'
    : user ? '/patient' : '/'

  const patientLinks = [
    { to: '/patient/book', label: 'Book', icon: CalendarPlus },
    { to: '/patient/appointments', label: 'My Appointments', icon: CalendarClock },
    { to: '/patient/feedback', label: 'Feedback', icon: MessageSquareHeart },
    { to: '/patient/profile', label: 'Profile', icon: UserCircle },
  ]
  const doctorLinks = [
    { to: '/doctor/appointments', label: 'Appointments', icon: ClipboardList },
    { to: '/doctor/patients', label: 'Patients', icon: Users },
    { to: '/doctor/earnings', label: 'Earnings', icon: Wallet },
  ]
  const adminLinks = [
    { to: '/admin/appointments', label: 'Appointments', icon: ClipboardList },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients', icon: Users },
  ]

  const links = user?.role === 'ADMIN' ? adminLinks
    : user?.role === 'DOCTOR' ? doctorLinks
    : user ? patientLinks : []

  const initials = (user?.userName || '?').slice(0, 2).toUpperCase()

  return (
    <nav className="sticky top-0 z-[100] bg-white/75 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 min-w-0">
          <Link to={dashboardPath} className="flex items-center gap-2 mr-4 flex-shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2.25} />
            </span>
            <span className="font-extrabold text-lg text-text tracking-tight hidden sm:inline">MediBook</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 relative">
            {user && links.map(l => {
              const active = location.pathname.startsWith(l.to)
              const Icon = l.icon
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative flex items-center gap-1.5 text-[13.5px] font-medium px-3.5 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                    active ? 'text-primary' : 'text-muted hover:text-text hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 -z-10 bg-primary/8 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setNotifOpen(v => !v)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted hover:bg-slate-100 hover:text-text transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger" />
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-xl shadow-card-hover p-4 text-sm"
                    >
                      <p className="font-semibold text-text mb-1">Notifications</p>
                      <p className="text-muted text-xs">You're all caught up — no new notifications.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors duration-200"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </span>
                  <span className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-[13px] font-semibold text-text">{user.userName}</span>
                    <span className="text-[11px] text-muted">{user.role}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted hidden lg:inline" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-card-hover p-1.5 text-sm overflow-hidden"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger hover:bg-red-50 transition-colors duration-150 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-muted hover:bg-slate-100"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted hover:text-text px-3 py-2 transition-colors duration-200">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-xl shadow-soft hover:shadow-glow hover:scale-[1.03] transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {user && mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map(l => {
                const Icon = l.icon
                const active = location.pathname.startsWith(l.to)
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? 'bg-primary/8 text-primary' : 'text-muted'}`}
                  >
                    <Icon className="w-4 h-4" /> {l.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
