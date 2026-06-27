import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function DoctorPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return }
    api.get(`/doctors/by-user/${user.userId}`)
      .then(r => api.get(`/patients/by-doctor/${r.data.doctorId}`))
      .then(p => { setPatients(p.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  return (
    <div style={s.page}>
      <h2 style={s.title}>My Patients</h2>
      {loading ? <p>Loading…</p> : patients.length === 0 ? (
        <p style={{ color: '#637082' }}>No patients assigned yet.</p>
      ) : (
        <div style={s.grid}>
          {patients.map(p => (
            <div key={p.patientId} style={s.card}>
              <div style={s.name}>{p.patientName}</div>
              <div style={s.meta}>{p.gender}, {p.age} yrs · {p.bloodGroup}</div>
              <div style={s.contact}>{p.mobileNo}</div>
              <div style={s.contact}>{p.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  title: { margin: '0 0 24px', fontSize: '22px', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' },
  card: { background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', padding: '18px' },
  name: { fontWeight: 600, fontSize: '14px', marginBottom: '4px' },
  meta: { color: '#637082', fontSize: '13px' },
  contact: { color: '#374151', fontSize: '13px', marginTop: '2px' },
}
