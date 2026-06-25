import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function Register() {
  const [form, setForm] = useState({
    userName: '', password: '', patientName: '', email: '',
    mobileNo: '', bloodGroup: '', gender: '', age: '', address: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { ...form, role: 'PATIENT', age: Number(form.age) })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, field, type = 'text', placeholder }) => (
    <div>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={form[field]}
        onChange={set(field)} placeholder={placeholder} required />
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Create account</h2>
        <p style={s.sub}>Patient registration</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.grid2}>
            <Field label="Username" field="userName" placeholder="Choose a username" />
            <Field label="Password" field="password" type="password" placeholder="••••••••" />
          </div>
          <div style={s.grid2}>
            <Field label="Full Name" field="patientName" placeholder="Your full name" />
            <Field label="Email" field="email" type="email" placeholder="you@email.com" />
          </div>
          <div style={s.grid2}>
            <Field label="Mobile No." field="mobileNo" placeholder="+91 XXXXX XXXXX" />
            <Field label="Age" field="age" type="number" placeholder="Age" />
          </div>
          <div style={s.grid3}>
            <div>
              <label style={s.label}>Gender</label>
              <select style={s.input} value={form.gender} onChange={set('gender')} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Blood Group</label>
              <select style={s.input} value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <Field label="Address" field="address" placeholder="City, State" />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Create Account'}
          </button>
        </form>
        <p style={s.foot}>Already registered? <Link to="/login" style={s.link}>Sign in</Link></p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f9', padding: '32px 16px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '640px' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 600 },
  sub: { margin: '0 0 24px', color: '#637082', fontSize: '14px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '5px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px' },
  btn: { marginTop: '8px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  foot: { textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: '#637082' },
  link: { color: '#0b7065', fontWeight: 500 },
}
