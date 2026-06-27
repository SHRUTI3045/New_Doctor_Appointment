import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function UpdateProfile() {
  const [form, setForm] = useState({ patientName: '', mobileNo: '', email: '', bloodGroup: '', gender: '', age: '', address: '' })
  const [patientId, setPatientId] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) return
    api.get('/patients/by-user/' + user.userId).then(r => {
      const p = r.data
      setPatientId(p.patientId)
      setForm({
        patientName: p.patientName || '',
        mobileNo: p.mobileNo || '',
        email: p.email || '',
        bloodGroup: p.bloodGroup || '',
        gender: p.gender || '',
        age: p.age || '',
        address: p.address || '',
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) return
    try {
      await api.put('/patients/' + patientId, { ...form, age: Number(form.age) })
      setMsg('Profile updated successfully!')
      setTimeout(() => navigate('/patient'), 2000)
    } catch {
      setMsg('Failed to update profile.')
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading…</div>

  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.card}>
        <h2 style={s.title}>Update Profile</h2>
        <p style={s.sub}>Update your personal information</p>
        {msg && <div style={msg.includes('success') ? s.success : s.error}>{msg}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} value={form.patientName} onChange={set('patientName')} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Mobile Number</label>
              <input style={s.input} value={form.mobileNo} onChange={set('mobileNo')} />
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" value={form.email} onChange={set('email')} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Age</label>
              <input style={s.input} type="number" value={form.age} onChange={set('age')} min="0" max="150" />
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Gender</label>
              <select style={s.input} value={form.gender} onChange={set('gender')}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Blood Group</label>
              <select style={s.input} value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
          <label style={s.label}>Address</label>
          <input style={s.input} value={form.address} onChange={set('address')} placeholder="City, State" />
          <button style={s.btn} type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '640px', margin: '0 auto', padding: '40px 24px' },
  backBtn: { background: 'none', border: 'none', color: '#637082', cursor: 'pointer', fontSize: '13px', padding: '0 0 12px 0', display: 'block' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '8px', padding: '36px' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 600 },
  sub: { margin: '0 0 24px', color: '#637082', fontSize: '14px' },
  success: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', fontWeight: 500, color: '#374151' },
  input: { padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px' },
  btn: { marginTop: '8px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
}
