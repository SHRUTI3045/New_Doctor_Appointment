import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Phone, Mail, Droplet } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { EmptyState } from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'

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
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold text-text">My Patients</h1>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : patients.length === 0 ? (
        <EmptyState icon={Users} title="No patients assigned yet" description="Patients who book with you will show up here." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {patients.map((p, i) => (
            <motion.div key={p.patientId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card gradient hover className="p-5 flex items-center gap-4">
                <Avatar name={p.patientName} size="md" />
                <div className="min-w-0">
                  <div className="font-bold text-[14.5px] text-text truncate">{p.patientName}</div>
                  <div className="text-xs text-muted mb-1.5">{p.gender}, {p.age} yrs</div>
                  <div className="flex flex-col gap-0.5 text-[12.5px] text-muted">
                    {p.mobileNo && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {p.mobileNo}</span>}
                    {p.email && <span className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.bloodGroup && <span className="flex items-center gap-1.5"><Droplet className="w-3 h-3" /> {p.bloodGroup}</span>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
