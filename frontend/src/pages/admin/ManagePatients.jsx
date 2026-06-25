import { useState, useEffect } from 'react'
import api from '../../api/axios'

const EMPTY = { patientName: '', email: '', mobileNo: '', bloodGroup: '', gender: '', age: '', address: '', password: '' }

export default function ManagePatients() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => api.get('/patients').then(r => setPatients(r.data))
  useEffect(() => { load() }, [])

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/patients/${editing}`, { ...form, patientId: editing, age: Number(form.age) })
        flash('Patient updated.')
      } else {
        await api.post('/patients', { ...form, age: Number(form.age) })
        flash('Patient added.')
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); load()
    } catch { flash('Operation failed.') }
  }

  const startEdit = (p) => {
    setForm({ ...p, age: String(p.age), password: '' })
    setEditing(p.patientId)
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Delete this patient?')) return
    await api.delete(`/patients/${id}`)
    flash('Patient removed.'); load()
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <h2 style={s.title}>Manage Patients</h2>
        <button style={s.addBtn} onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}>+ Add Patient</button>
      </div>
      {msg && <div style={s.info}>{msg}</div>}

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editing ? 'Edit Patient' : 'Add Patient'}</h3>
          <form onSubmit={handleSubmit} style={s.formGrid}>
            {[['patientName','Full Name'],['email','Email'],['mobileNo','Mobile'],['bloodGroup','Blood Group']].map(([f,l]) => (
              <div key={f}><label style={s.label}>{l}</label><input style={s.input} value={form[f]} onChange={set(f)} required={!editing} /></div>
            ))}
            <div>
              <label style={s.label}>Gender</label>
              <select style={s.input} value={form.gender} onChange={set('gender')} required>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><label style={s.label}>Age</label><input style={s.input} type="number" value={form.age} onChange={set('age')} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={s.label}>Address</label><input style={s.input} value={form.address} onChange={set('address')} /></div>
            {!editing && <div><label style={s.label}>Password</label><input style={s.input} type="password" value={form.password} onChange={set('password')} required /></div>}
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button style={s.saveBtn} type="submit">{editing ? 'Update' : 'Add'}</button>
              <button style={s.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            {['Name','Email','Mobile','Gender','Age','Blood Group','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.patientId} style={s.tr}>
                <td style={s.td}>{p.patientName}</td>
                <td style={s.td}>{p.email}</td>
                <td style={s.td}>{p.mobileNo}</td>
                <td style={s.td}>{p.gender}</td>
                <td style={s.td}>{p.age}</td>
                <td style={s.td}>{p.bloodGroup}</td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => startEdit(p)}>Edit</button>
                  <button style={s.delBtn} onClick={() => remove(p.patientId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '22px', fontWeight: 600 },
  addBtn: { background: '#0b7065', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' },
  info: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  formCard: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '24px', marginBottom: '24px' },
  formTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: 600 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13.5px' },
  saveBtn: { padding: '8px 20px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { padding: '8px 20px', background: '#f3f4f6', color: '#374151', border: '1px solid #d8e2ec', borderRadius: '4px', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '11px 14px', fontSize: '13.5px' },
  editBtn: { background: '#dbeafe', color: '#1e3a5f', border: 'none', padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' },
  delBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
}
