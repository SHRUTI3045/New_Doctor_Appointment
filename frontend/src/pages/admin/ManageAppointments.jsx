import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarClock, Search, Check, X as XIcon, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { StatusBadge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { EmptyState } from '../../components/ui/EmptyState'

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED']

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [msg, setMsg] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const load = () => api.get('/appointments').then(r => setAppointments(r.data))
  useEffect(() => { load() }, [])
  useEffect(() => { setPage(1) }, [search, filter])

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const approve = async (id) => {
    await api.put('/appointments/' + id + '/approve')
    flash('Approved.'); load()
  }
  const reject = async (id) => {
    await api.put('/appointments/' + id + '/reject', { remark: 'Rejected by admin' })
    flash('Rejected.'); load()
  }

  const toggleSelect = (id) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.appointmentStatus === filter)
  const searched = filtered.filter(a => !search || a.patient?.patientName?.toLowerCase().includes(search.toLowerCase()) || a.doctor?.doctorName?.toLowerCase().includes(search.toLowerCase()))
  const paginated = searched.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const pendingSelected = [...selected].filter(id => appointments.find(a => a.appointmentId === id && a.appointmentStatus === 'PENDING'))

  const approveAll = async () => {
    await Promise.all(pendingSelected.map(id => api.put('/appointments/' + id + '/approve')))
    flash(pendingSelected.length + ' appointments approved.')
    setSelected(new Set()); load()
  }
  const rejectAll = async () => {
    await Promise.all(pendingSelected.map(id => api.put('/appointments/' + id + '/reject', { remark: 'Bulk rejected' })))
    flash(pendingSelected.length + ' appointments rejected.')
    setSelected(new Set()); load()
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-text">Manage Appointments</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input icon={Search} placeholder="Search patient or doctor…" value={search} onChange={e => setSearch(e.target.value)} className="w-56" />
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  filter === f ? 'bg-primary text-white border-primary shadow-soft' : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-5 border bg-emerald-50 text-emerald-700 border-emerald-100">
            <CheckCircle2 className="w-4 h-4" /> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 rounded-xl mb-4 flex-wrap">
            <span className="text-[13px] font-semibold text-emerald-700">{selected.size} selected ({pendingSelected.length} pending)</span>
            <Button size="sm" variant="success" disabled={pendingSelected.length === 0} onClick={approveAll}><Check className="w-3.5 h-3.5" /> Approve Selected</Button>
            <Button size="sm" variant="danger" disabled={pendingSelected.length === 0} onClick={rejectAll}><XIcon className="w-3.5 h-3.5" /> Reject Selected</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No appointments found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-4 py-3 w-8"></th>
                  {['ID', 'Patient', 'Doctor', 'Date', 'Status', 'Remark', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(a => (
                  <tr key={a.appointmentId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      {a.appointmentStatus === 'PENDING' && (
                        <input type="checkbox" checked={selected.has(a.appointmentId)} onChange={() => toggleSelect(a.appointmentId)}
                          className="w-4 h-4 rounded border-border accent-primary" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted">#{a.appointmentId}</td>
                    <td className="px-4 py-3 text-[13.5px] font-medium text-text">{a.patient?.patientName}</td>
                    <td className="px-4 py-3 text-[13px]">
                      <div className="text-text font-medium">Dr. {a.doctor?.doctorName}</div>
                      <div className="text-muted text-[12px]">{a.doctor?.speciality}</div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted whitespace-nowrap">{a.appointmentDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.appointmentStatus} /></td>
                    <td className="px-4 py-3 text-[13px] text-muted">{a.remark || '—'}</td>
                    <td className="px-4 py-3">
                      {a.appointmentStatus === 'PENDING' && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="success" onClick={() => approve(a.appointmentId)}><Check className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="danger" onClick={() => reject(a.appointmentId)}><XIcon className="w-3.5 h-3.5" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={searched.length} page={page} perPage={PER_PAGE} onChange={setPage} />
      </Card>
    </div>
  )
}
