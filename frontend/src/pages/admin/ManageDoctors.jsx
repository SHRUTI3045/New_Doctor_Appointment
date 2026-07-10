import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Stethoscope, Search, Plus, Pencil, Trash2, CheckCircle2, X } from 'lucide-react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Label } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { Pagination } from '../../components/ui/Pagination'
import { EmptyState } from '../../components/ui/EmptyState'

const EMPTY = { doctorName: '', speciality: '', location: '', hospitalName: '', mobileNo: '', email: '', password: '', chargedPerVisit: '' }

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
    ['doctorName', 'Doctor Name'], ['speciality', 'Speciality'], ['location', 'Location'],
    ['hospitalName', 'Hospital'], ['mobileNo', 'Mobile'], ['email', 'Email'], ['chargedPerVisit', 'Charge/Visit (₹)']
  ]

  const searched = doctors.filter(d => !search || d.doctorName?.toLowerCase().includes(search.toLowerCase()) || d.speciality?.toLowerCase().includes(search.toLowerCase()) || d.location?.toLowerCase().includes(search.toLowerCase()))
  const paginated = searched.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-text">Manage Doctors</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input icon={Search} placeholder="Search name, speciality, location…" value={search} onChange={e => setSearch(e.target.value)} className="w-56" />
          <Button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}><Plus className="w-4 h-4" /> Add Doctor</Button>
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
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <Card gradient className="p-6">
              <h3 className="font-bold text-[15px] text-text mb-4">{editing ? 'Edit Doctor' : 'Add Doctor'}</h3>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                {fields.map(([f, l]) => (
                  <div key={f}><Label>{l}</Label><Input value={form[f]} onChange={set(f)} required={!editing} /></div>
                ))}
                {!editing && <div><Label>Password</Label><Input type="password" value={form.password} onChange={set('password')} required /></div>}
                <div className="sm:col-span-2 flex gap-2 mt-1">
                  <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}><X className="w-4 h-4" /> Cancel</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState icon={Stethoscope} title="No doctors found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {['Doctor', 'Speciality', 'Hospital', 'Location', 'Mobile', 'Charge', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(d => (
                  <tr key={d.doctorId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={d.doctorName} size="sm" />
                        <span className="text-[13.5px] font-medium text-text">Dr. {d.doctorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted">{d.speciality}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{d.hospitalName}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{d.location}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{d.mobileNo}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-primary">₹{d.chargedPerVisit}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => startEdit(d)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="danger" onClick={() => remove(d.doctorId)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
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
