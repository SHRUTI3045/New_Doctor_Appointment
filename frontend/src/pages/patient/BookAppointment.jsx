import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [specialities, setSpecialities] = useState([])
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '' })
  const [patientId, setPatientId] = useState(null)
  const [msg, setMsg] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/doctors/list').then(r => {
      setDoctors(r.data)
      const specs = [...new Set(r.data.map(d => d.speciality).filter(Boolean))]
      setSpecialities(specs)
    })
    // fetch patient id by matching userName with patients
    api.get('/patients').then(r => {
      const p = r.data.find(p => p.email?.toLowerCase() === user?.userName?.toLowerCase()
        || p.patientName?.toLowerCase().includes(user?.userName?.toLowerCase()))
      if (p) setPatientId(p.patientId)
    }).catch(() => {})
  }, [user])

  const filtered = filter ? doctors.filter(d => d.speciality === filter) : doctors

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId) { setMsg('Patient profile not found. Contact admin.'); return }
    try {
      await api.post('/appointments', {
        patient: { patientId },
        doctor: { doctorId: Number(form.doctorId) },
        appointmentDate: form.appointmentDate,
      })
      setMsg('Appointment booked successfully! Awaiting approval.')
      setTimeout(() => navigate('/patient/appointments'), 2000)
    } catch {
      setMsg('Failed to book appointment.')
    }
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>Book Appointment</h2>
      {msg && <div style={msg.includes('success') ? s.success : s.error}>{msg}</div>}
      <div style={s.layout}>
        <div style={s.doctorList}>
          <div style={s.filterRow}>
            <span style={s.sectionLabel}>Available Doctors</span>
            <select style={s.select} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Specialities</option>
              {specialities.map(sp => <option key={sp}>{sp}</option>)}
            </select>
          </div>
          {filtered.map(doc => (
            <div key={doc.doctorId}
              style={{ ...s.doctorCard, ...(form.doctorId == doc.doctorId ? s.selected : {}) }}
              onClick={() => setForm(p => ({ ...p, doctorId: doc.doctorId }))}>
              <div style={s.docName}>{doc.doctorName}</div>
              <div style={s.docMeta}>{doc.speciality} · {doc.hospitalName}</div>
              <div style={s.docFee}>₹{doc.chargedPerVisit} per visit</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={s.formPanel}>
          <h3 style={s.formTitle}>Appointment Details</h3>
          <label style={s.label}>Selected Doctor</label>
          <input style={s.input} readOnly
            value={doctors.find(d => d.doctorId == form.doctorId)?.doctorName || 'None selected'} />
          <label style={s.label}>Appointment Date</label>
          <input style={s.input} type="date" required
            min={new Date().toISOString().split('T')[0]}
            value={form.appointmentDate}
            onChange={e => setForm(p => ({ ...p, appointmentDate: e.target.value }))} />
          <button style={s.btn} type="submit">Book Appointment</button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px' },
  title: { margin: '0 0 20px', fontSize: '22px', fontWeight: 600 },
  success: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' },
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  sectionLabel: { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#637082' },
  select: { padding: '5px 8px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px' },
  doctorList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  doctorCard: { border: '1px solid #d8e2ec', borderRadius: '6px', padding: '14px 16px', cursor: 'pointer', background: '#fff', transition: 'border-color 0.15s' },
  selected: { borderColor: '#0b7065', background: '#e0f3f1' },
  docName: { fontWeight: 600, fontSize: '14px' },
  docMeta: { color: '#637082', fontSize: '13px', marginTop: '2px' },
  docFee: { color: '#0b7065', fontSize: '13px', marginTop: '4px', fontWeight: 500 },
  formPanel: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'start' },
  formTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: 600 },
  label: { fontSize: '13px', fontWeight: 500, color: '#374151', marginTop: '12px' },
  input: { padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px', width: '100%' },
  btn: { marginTop: '20px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
}
