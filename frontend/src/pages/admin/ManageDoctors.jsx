import { useState, useEffect } from 'react'
import api from '../../api/axios'

const EMPTY = { doctorName: '', speciality: '', location: '', hospitalName: '', mobileNo: '', email: '', password: '', chargedPerVisit: '' }

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px 0', borderTop: '1px solid #ebf0f5' }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}
        style={{ padding: '5px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', background: page === 1 ? '#f8fafc' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#374151', fontSize: '13px' }}>
        ← Prev
      </button>
      <span style={{ fontSize: '13px', color: '#637082', minWidth: '90px', textAlign: 'center' }}>
        Page {page} of {pages} ({total} total)
      </span>
      <button disabled={page === pages} onClick={() => onChange(page + 1)}
        style={{ padding: '5px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', background: page === pages ? '#f8fafc' : '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', color: '#374151', fontSize: '13px' }}>
        Next →
      </button>
    </div>
  )
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const load = () => api.get('/doctors/list').then(r => setDoctors(r.data))
  useEffect(() => { load() }, [])

  // Reset page when search changes
  useEffect(() => { setPage(1) }, [search])

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, chargedPerVisit: Number(form.chargedPerVisit) }
    try {
      if (editing) {
        await api.put(`/doctors/${editing}`, { ...payload, doctorId: editing })
        flash('Doctor updated.')
      } else {
        await api.post('/doctors', payload)
        flash('Doctor added.')
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); load()
    } catch { flash('Operation failed.') }
  }

  const startEdit = (d) => {
    setForm({ ...d, chargedPerVisit: String(d.chargedPerVisit), password: '' })
    setEditing(d.doctorId)
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Delete this doctor?')) return
    await api.delete(`/doctors/${id}`)
    flash('Doctor removed.'); load()
  }

  const fields = [
    ['doctorName','Doctor Name'],['speciality','Speciality'],['location','Location'],
    ['hospitalName','Hospital'],['mobileNo','Mobile'],['email','Email'],['chargedPerVisit','Charge/Visit (₹)']
  ]

  const searched = doctors.filter(d => !search || d.doctorName?.toLowerCase().includes(search.toLowerCase()) || d.speciality?.toLowerCase().includes(search.toLowerCase()) || d.location?.toLowerCase().includes(search.toLowerCase()))
  const paginated = searched.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <h2 style={s.title}>Manage Doctors</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            style={s.searchInput}
            placeholder="Search name, speciality, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={s.addBtn} onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}>+ Add Doctor</button>
        </div>
      </div>
      {msg && <div style={s.info}>{msg}</div>}

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editing ? 'Edit Doctor' : 'Add Doctor'}</h3>
          <form onSubmit={handleSubmit} style={s.formGrid}>
            {fields.map(([f, l]) => (
              <div key={f}><label style={s.label}>{l}</label><input style={s.input} value={form[f]} onChange={set(f)} required={!editing} /></div>
            ))}
            {!editing && <div><label style={s.label}>Password</label><input style={s.input} type="password" value={form.password} onChange={set('password')} required /></div>}
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button style={s.saveBtn} type="submit">{editing ? 'Update' : 'Add'}</button>
              <button style={s.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            {['Name','Speciality','Hospital','Location','Mobile','Charge','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {paginated.map(d => (
              <tr key={d.doctorId} style={s.tr}>
                <td style={s.td}>{d.doctorName}</td>
                <td style={s.td}>{d.speciality}</td>
                <td style={s.td}>{d.hospitalName}</td>
                <td style={s.td}>{d.location}</td>
                <td style={s.td}>{d.mobileNo}</td>
                <td style={s.td}>₹{d.chargedPerVisit}</td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => startEdit(d)}>Edit</button>
                  <button style={s.delBtn} onClick={() => remove(d.doctorId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {searched.length === 0 && <p style={s.empty}>No doctors found.</p>}
        <Pagination total={searched.length} page={page} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '22px', fontWeight: 600 },
  addBtn: { background: '#0b7065', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' },
  searchInput: { padding: '6px 10px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px', width: '200px' },
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
  empty: { textAlign: 'center', padding: '24px', color: '#637082', fontSize: '14px' },
}
