import { useState, useEffect } from 'react'
import api from '../../api/axios'

const STATUS_STYLE = {
  PENDING:   { background: '#fef3c7', color: '#92400e' },
  APPROVED:  { background: '#d1fae5', color: '#065f46' },
  REJECTED:  { background: '#fee2e2', color: '#991b1b' },
  CANCELLED: { background: '#f3f4f6', color: '#6b7280' },
  COMPLETED: { background: '#dcfce7', color: '#166534' },
}

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

  // Reset page when search or filter changes
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
    <div style={s.page}>
      <div style={s.topBar}>
        <h2 style={s.title}>Manage Appointments</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            style={s.searchInput}
            placeholder="Search patient or doctor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={s.filters}>
            {['ALL','PENDING','APPROVED','COMPLETED','REJECTED','CANCELLED'].map(f => (
              <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>
      {msg && <div style={s.info}>{msg}</div>}
      {selected.size > 0 && (
        <div style={s.bulkBar}>
          <span style={s.bulkCount}>{selected.size} selected ({pendingSelected.length} pending)</span>
          <button style={s.bulkApprove} onClick={approveAll} disabled={pendingSelected.length === 0}>Approve Selected</button>
          <button style={s.bulkReject} onClick={rejectAll} disabled={pendingSelected.length === 0}>Reject Selected</button>
          <button style={s.bulkClear} onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            <th style={s.th}></th>
            {['ID','Patient','Doctor','Date','Status','Remark','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {paginated.map(a => (
              <tr key={a.appointmentId} style={s.tr}>
                <td style={s.td}>
                  {a.appointmentStatus === 'PENDING' && (
                    <input type="checkbox" checked={selected.has(a.appointmentId)}
                      onChange={() => toggleSelect(a.appointmentId)} />
                  )}
                </td>
                <td style={s.td}>#{a.appointmentId}</td>
                <td style={s.td}>{a.patient?.patientName}</td>
                <td style={s.td}>Dr. {a.doctor?.doctorName}<br/><span style={s.spec}>{a.doctor?.speciality}</span></td>
                <td style={s.td}>{a.appointmentDate}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...STATUS_STYLE[a.appointmentStatus] }}>
                    {a.appointmentStatus}
                  </span>
                </td>
                <td style={s.td}>{a.remark || '—'}</td>
                <td style={s.td}>
                  {a.appointmentStatus === 'PENDING' && (
                    <>
                      <button style={s.approveBtn} onClick={() => approve(a.appointmentId)}>Approve</button>
                      <button style={s.rejectBtn} onClick={() => reject(a.appointmentId)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {searched.length === 0 && <p style={s.empty}>No appointments found.</p>}
        <Pagination total={searched.length} page={page} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { margin: 0, fontSize: '22px', fontWeight: 600 },
  filters: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: { padding: '5px 12px', border: '1px solid #d8e2ec', borderRadius: '4px', background: '#fff', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#637082' },
  filterActive: { background: '#0b7065', color: 'white', borderColor: '#0b7065' },
  searchInput: { padding: '6px 10px', border: '1px solid #d8e2ec', borderRadius: '4px', fontSize: '13px', width: '200px' },
  info: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13.5px' },
  bulkBar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '4px', marginBottom: '12px', flexWrap: 'wrap' },
  bulkCount: { fontSize: '13px', fontWeight: 600, color: '#065f46', marginRight: '4px' },
  bulkApprove: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  bulkReject: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  bulkClear: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #d8e2ec', borderRadius: '6px', overflow: 'hidden' },
  thead: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#637082', borderBottom: '2px solid #d8e2ec' },
  tr: { borderBottom: '1px solid #ebf0f5' },
  td: { padding: '11px 14px', fontSize: '13.5px', verticalAlign: 'top' },
  spec: { fontSize: '12px', color: '#637082' },
  badge: { fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' },
  approveBtn: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' },
  rejectBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '24px', color: '#637082', fontSize: '14px' },
}
