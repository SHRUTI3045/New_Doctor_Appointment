import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function DoctorModal({ doc, ratings, onBook, onClose }) {
  if (!doc) return null
  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={m.box} onClick={e => e.stopPropagation()}>
        <button style={m.closeBtn} onClick={onClose}>×</button>
        <h3 style={m.modalTitle}>{doc.doctorName}</h3>
        <div style={m.fieldList}>
          {[
            ['Speciality', doc.speciality],
            ['Hospital', doc.hospitalName],
            ['Location', doc.location],
            ['Mobile', doc.mobileNo],
            ['Email', doc.email],
            ['Fee per Visit', doc.chargedPerVisit ? `₹${doc.chargedPerVisit}` : null],
            ['Rating', ratings[doc.doctorId] ? `★ ${ratings[doc.doctorId]}` : null],
          ].filter(([, v]) => v).map(([label, value]) => (
            <div key={label} style={m.fieldRow}>
              <span style={m.fieldLabel}>{label}</span>
              <span style={m.fieldValue}>{value}</span>
            </div>
          ))}
        </div>
        <button style={m.bookBtn} onClick={onBook}>Book with this Doctor</button>
      </div>
    </div>
  )
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [specialities, setSpecialities] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [ratings, setRatings] = useState({})
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '' })
  const [patientId, setPatientId] = useState(null)
  const [msg, setMsg] = useState('')
  const [modalDoc, setModalDoc] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/doctors/list').then(r => {
      setDoctors(r.data)
      const specs = [...new Set(r.data.map(d => d.speciality).filter(Boolean))]
      setSpecialities(specs)
      // fetch ratings
      Promise.all(r.data.map(d =>
        api.get('/feedback/doctor/' + d.doctorId)
          .then(fb => ({
            id: d.doctorId,
            avg: fb.data.length ? (fb.data.reduce((sum, f) => sum + f.rating, 0) / fb.data.length).toFixed(1) : null
          }))
          .catch(() => ({ id: d.doctorId, avg: null }))
      )).then(rs => {
        const map = {}
        rs.forEach(r => { if (r.avg) map[r.id] = r.avg })
        setRatings(map)
      })
    })
    if (user?.userId) {
      api.get(`/patients/by-user/${user.userId}`).then(r => setPatientId(r.data.patientId)).catch(() => {})
    }
  }, [user])

  const filtered = doctors.filter(d =>
    (!filter || d.speciality === filter) &&
    (!search || d.doctorName.toLowerCase().includes(search.toLowerCase()) ||
                (d.location && d.location.toLowerCase().includes(search.toLowerCase())))
  )

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
      <button style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>
      <h2 style={s.title}>Book Appointment</h2>
      {msg && <div style={msg.includes('success') ? s.success : s.error}>{msg}</div>}
      <div style={s.layout}>
        <div style={s.doctorList}>
          <div style={s.filterRow}>
            <span style={s.sectionLabel}>Available Doctors</span>
            <input style={s.searchInput} placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
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
              {ratings[doc.doctorId] && <div style={s.docRating}>★ {ratings[doc.doctorId]}</div>}
              <div style={s.cardBtnRow} onClick={e => e.stopPropagation()}>
                <button style={s.selectBtn} onClick={() => setForm(p => ({ ...p, doctorId: doc.doctorId }))}>Select</button>
                <button style={s.detailsBtn} onClick={() => setModalDoc(doc)}>Details</button>
              </div>
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
      <DoctorModal
        doc={modalDoc}
        ratings={ratings}
        onBook={() => { setForm(p => ({ ...p, doctorId: modalDoc.doctorId })); setModalDoc(null) }}
        onClose={() => setModalDoc(null)}
      />
    </div>
  )
}

const s = {
  page: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px' },
  title: { margin: '0 0 20px', fontSize: '22px', fontWeight: 600 },
  success: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' },
  filterRow: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  sectionLabel: { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#637082' },
  select: { padding: '5px 8px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px' },
  doctorList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  doctorCard: { border: '1px solid #d8e2ec', borderRadius: '6px', padding: '14px 16px', cursor: 'pointer', background: '#fff', transition: 'border-color 0.15s' },
  selected: { borderColor: '#0b7065', background: '#e0f3f1' },
  docName: { fontWeight: 600, fontSize: '14px', color: '#1a1a2e' },
  docMeta: { color: '#637082', fontSize: '13px', marginTop: '2px' },
  docFee: { color: '#0b7065', fontSize: '13px', marginTop: '4px', fontWeight: 500 },
  searchInput: { padding: '7px 10px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px', width: '200px' },
  docRating: { color: '#f59e0b', fontSize: '12px', marginTop: '3px', fontWeight: 500 },
  cardBtnRow: { display: 'flex', gap: '8px', marginTop: '10px' },
  selectBtn: { padding: '5px 14px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  detailsBtn: { padding: '5px 14px', background: 'white', color: '#1e3a5f', border: '1px solid #1e3a5f', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', color: '#637082', cursor: 'pointer', fontSize: '13px', padding: '0 0 12px 0', display: 'block' },
  formPanel: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'start' },
  formTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: 600 },
  label: { fontSize: '13px', fontWeight: 500, color: '#374151', marginTop: '12px' },
  input: { padding: '9px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '14px', width: '100%' },
  btn: { marginTop: '20px', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
}

const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  box: { position: 'relative', background: 'white', borderRadius: '8px', padding: '28px', maxWidth: '440px', width: '90%', maxHeight: '80vh', overflowY: 'auto' },
  closeBtn: { position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#637082', lineHeight: 1 },
  modalTitle: { margin: '0 0 18px', fontSize: '18px', fontWeight: 700, color: '#1a1a2e', paddingRight: '24px' },
  fieldList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' },
  fieldRow: { display: 'flex', gap: '10px' },
  fieldLabel: { fontSize: '12px', fontWeight: 600, color: '#637082', minWidth: '110px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  fieldValue: { fontSize: '14px', color: '#1a1a2e' },
  bookBtn: { width: '100%', padding: '10px', background: '#0b7065', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
}
