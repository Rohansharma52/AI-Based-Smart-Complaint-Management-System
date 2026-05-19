import React, { useState, useEffect, useCallback } from 'react'
import { complaintAPI, aiAPI } from '../../services/api'
import { LoadingSpinner, SkeletonCard } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ICONS = { 'Water Supply':'💧','Electricity':'⚡','Roads':'🛣️','Sanitation':'🗑️','Public Safety':'🛡️','Healthcare':'🏥','Education':'📚','Other':'📌' }
const CAT_COLORS = { 'Water Supply':'#3b82f6','Electricity':'#f59e0b','Roads':'#8b5cf6','Sanitation':'#10b981','Public Safety':'#ef4444','Healthcare':'#ec4899','Education':'#06b6d4','Other':'#64748b' }
const CATEGORIES = ['All','Water Supply','Electricity','Roads','Sanitation','Public Safety','Healthcare','Education','Other']
const PRIORITIES = ['All','High','Medium','Low']

const StatusBadge = ({ status }) => {
  const cfg = {
    'Pending':     { bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.3)', dot:'#f59e0b' },
    'In Progress': { bg:'rgba(59,130,246,0.12)',  color:'#60a5fa', border:'rgba(59,130,246,0.3)',  dot:'#3b82f6' },
    'Resolved':    { bg:'rgba(16,185,129,0.12)',  color:'#34d399', border:'rgba(16,185,129,0.3)',  dot:'#10b981' },
  }[status] || {}
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, boxShadow:`0 0 6px ${cfg.dot}`, display:'inline-block' }} />
      {status}
    </span>
  )
}

const PriorityBadge = ({ priority }) => {
  if (!priority) return <span style={{ color:'#334155', fontSize:12 }}>—</span>
  const cfg = {
    'High':   { bg:'rgba(239,68,68,0.12)',  color:'#f87171', border:'rgba(239,68,68,0.3)',  icon:'🔴' },
    'Medium': { bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.3)', icon:'🟡' },
    'Low':    { bg:'rgba(16,185,129,0.12)', color:'#34d399', border:'rgba(16,185,129,0.3)', icon:'🟢' },
  }[priority] || {}
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
      {cfg.icon} {priority}
    </span>
  )
}

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total:0, pages:1, page:1 })
  const [filters, setFilters] = useState({ category:'All', status:'All', priority:'All', page:1 })
  const [searchLoc, setSearchLoc] = useState('')
  const [searching, setSearching] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [analyzing, setAnalyzing] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: filters.page, limit: 8 }
      if (filters.category !== 'All') params.category = filters.category
      if (filters.status !== 'All') params.status = filters.status
      const res = await complaintAPI.getAll(params)
      let data = res.data || []
      if (filters.priority !== 'All') data = data.filter(c => c.aiAnalysis?.priority === filters.priority)
      setComplaints(data)
      setPagination(res.pagination || { total:0, pages:1, page:1 })
      setIsSearch(false)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchLoc.trim()) { fetchAll(); return }
    setSearching(true)
    try {
      const res = await complaintAPI.search({ location: searchLoc, category: filters.category !== 'All' ? filters.category : undefined })
      let data = res.data || []
      if (filters.priority !== 'All') data = data.filter(c => c.aiAnalysis?.priority === filters.priority)
      setComplaints(data)
      setPagination({ total: data.length, pages:1, page:1 })
      setIsSearch(true)
    } catch (err) { console.error(err) }
    finally { setSearching(false) }
  }

  const handleStatus = async (id, status) => {
    setUpdating(id + status)
    try {
      const res = await complaintAPI.update(id, { status })
      setComplaints(prev => prev.map(c => c._id === id ? res.data : c))
      toast.success(`Status updated → ${status}`)
    } catch (err) { toast.error(err.message) }
    finally { setUpdating(null) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return
    try {
      await complaintAPI.delete(id)
      setComplaints(prev => prev.filter(c => c._id !== id))
      toast.success('Complaint deleted')
    } catch (err) { toast.error(err.message) }
  }

  const handleAnalyze = async (c) => {
    setAnalyzing(c._id)
    try {
      const res = await aiAPI.analyze({ title:c.title, description:c.description, category:c.category, location:c.location, complaintId:c._id })
      setComplaints(prev => prev.map(x => x._id === c._id ? { ...x, aiAnalysis: res.data } : x))
      toast.success('AI analysis complete! 🤖')
    } catch (err) { toast.error(err.message) }
    finally { setAnalyzing(null) }
  }

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }))

  return (
    <div className="page page-enter">

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'white', marginBottom:4 }}>
            All <span className="gradient-text">Complaints</span>
          </h1>
          <p style={{ color:'#64748b', fontSize:13 }}>
            {isSearch ? `Search results for "${searchLoc}"` : `${pagination.total} total complaints`}
          </p>
        </div>
        {/* Quick stats strip */}
        <div style={{ display:'flex', gap:10 }}>
          {[
            { label:'Total', value: pagination.total, color:'#6366f1' },
            { label:'Pending', value: complaints.filter(c=>c.status==='Pending').length, color:'#f59e0b' },
            { label:'Resolved', value: complaints.filter(c=>c.status==='Resolved').length, color:'#10b981' },
          ].map((s,i) => (
            <div key={i} style={{ padding:'8px 16px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25`, textAlign:'center', minWidth:70 }}>
              <div style={{ fontSize:18, fontWeight:900, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:'#475569', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="card" style={{ padding:20, marginBottom:24 }}>
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:10, marginBottom:16 }}>
          <div style={{ flex:1, position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>📍</span>
            <input className="input" placeholder="Search by location (e.g. Ghaziabad, Delhi...)"
              value={searchLoc} onChange={e => setSearchLoc(e.target.value)}
              style={{ paddingLeft:44 }} />
          </div>
          <button type="submit" disabled={searching} className="btn btn-primary" style={{ padding:'10px 22px', flexShrink:0 }}>
            {searching ? <LoadingSpinner size="sm" /> : '🔍'} Search
          </button>
          {isSearch && (
            <button type="button" onClick={() => { setSearchLoc(''); fetchAll() }} className="btn btn-secondary" style={{ padding:'10px 16px', flexShrink:0 }}>
              ✕ Clear
            </button>
          )}
        </form>

        {/* Filter chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }}>
          {/* Category */}
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Category</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter('category', c)}
                className={`chip ${filters.category===c ? 'active' : ''}`}>
                {c !== 'All' && ICONS[c] ? `${ICONS[c]} ` : ''}{c}
              </button>
            ))}
          </div>
          <div style={{ width:1, height:24, background:'rgba(255,255,255,0.06)' }} />
          {/* Status */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Status</span>
            {['All','Pending','In Progress','Resolved'].map(s => (
              <button key={s} onClick={() => setFilter('status', s)} className={`chip ${filters.status===s ? 'active' : ''}`}>{s}</button>
            ))}
          </div>
          <div style={{ width:1, height:24, background:'rgba(255,255,255,0.06)' }} />
          {/* Priority */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Priority</span>
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setFilter('priority', p)} className={`chip ${filters.priority===p ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Complaint Cards ── */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(480px, 1fr))', gap:16 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : complaints.length === 0 ? (
        <div className="card" style={{ padding:'80px 20px', textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>📭</div>
          <h3 style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:8 }}>No complaints found</h3>
          <p style={{ color:'#64748b', fontSize:13 }}>{isSearch ? `No results for "${searchLoc}"` : 'Try adjusting your filters'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {complaints.map((c, i) => {
            const catColor = CAT_COLORS[c.category] || '#6366f1'
            const isExpanded = expanded === c._id
            return (
              <div key={c._id} className="card anim-fade-up" style={{ padding:0, overflow:'hidden', animationDelay:`${i*0.05}s`, transition:'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)' }}>

                {/* Colored left accent bar */}
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:`linear-gradient(180deg, ${catColor}, ${catColor}60)`, borderRadius:'20px 0 0 20px' }} />

                <div style={{ padding:'20px 22px 20px 26px' }}>
                  {/* Top row */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                    {/* Category icon */}
                    <div style={{ width:46, height:46, borderRadius:14, background:`${catColor}18`, border:`1px solid ${catColor}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, boxShadow:`0 4px 12px ${catColor}20` }}>
                      {ICONS[c.category] || '📌'}
                    </div>

                    {/* Title + meta */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:5 }}>
                        <h3 style={{ fontSize:15, fontWeight:800, color:'white', margin:0 }}>{c.title}</h3>
                        <span style={{ padding:'2px 9px', borderRadius:8, fontSize:11, fontWeight:700, background:`${catColor}18`, color:catColor, border:`1px solid ${catColor}25` }}>{c.category}</span>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:12, fontSize:12, color:'#475569' }}>
                        <span>👤 <span style={{ color:'#94a3b8' }}>{c.name}</span></span>
                        <span>✉️ <span style={{ color:'#94a3b8' }}>{c.email}</span></span>
                        <span>📍 <span style={{ color:'#94a3b8' }}>{c.location}</span></span>
                        <span>🗓️ <span style={{ color:'#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end', flexShrink:0 }}>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.aiAnalysis?.priority} />
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.6, marginBottom:16, paddingLeft:60, display:'-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : 2, WebkitBoxOrient:'vertical', overflow: isExpanded ? 'visible' : 'hidden' }}>
                    {c.description}
                  </p>

                  {/* ── Status Update (MOST IMPORTANT) ── */}
                  <div style={{ paddingLeft:60, marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.12)', borderRadius:14 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginRight:4 }}>Update Status:</span>
                      {['Pending','In Progress','Resolved'].map(s => {
                        const isActive = c.status === s
                        const colors = { 'Pending':'#f59e0b', 'In Progress':'#3b82f6', 'Resolved':'#10b981' }
                        const col = colors[s]
                        return (
                          <button key={s} onClick={() => handleStatus(c._id, s)}
                            disabled={updating === c._id + s || isActive}
                            style={{
                              padding:'6px 14px', borderRadius:10, fontSize:12, fontWeight:700,
                              cursor: isActive ? 'default' : 'pointer',
                              background: isActive ? `${col}20` : 'rgba(255,255,255,0.04)',
                              color: isActive ? col : '#64748b',
                              border: `1.5px solid ${isActive ? col + '50' : 'rgba(255,255,255,0.08)'}`,
                              boxShadow: isActive ? `0 0 12px ${col}30` : 'none',
                              transition:'all 0.2s ease', fontFamily:'Inter, sans-serif',
                              transform: isActive ? 'scale(1.02)' : 'scale(1)'
                            }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = `${col}15`; e.currentTarget.style.color = col; e.currentTarget.style.borderColor = `${col}40` } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}>
                            {updating === c._id + s ? '...' : s}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* AI Analysis Result (if available) */}
                  {isExpanded && c.aiAnalysis?.priority && (
                    <div style={{ paddingLeft:60, marginBottom:14 }} className="anim-fade-in">
                      <div style={{ padding:'16px', background:'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.04))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                          <span style={{ fontSize:18 }}>🤖</span>
                          <span style={{ fontSize:12, fontWeight:800, color:'#a5b4fc', textTransform:'uppercase', letterSpacing:'0.06em' }}>AI Analysis Result</span>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                          <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                            <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Priority</p>
                            <PriorityBadge priority={c.aiAnalysis.priority} />
                          </div>
                          <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                            <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Department</p>
                            <p style={{ fontSize:13, color:'white', fontWeight:700 }}>{c.aiAnalysis.department}</p>
                          </div>
                        </div>
                        {c.aiAnalysis.summary && (
                          <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10, marginBottom:8 }}>
                            <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>📝 Summary</p>
                            <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6 }}>{c.aiAnalysis.summary}</p>
                          </div>
                        )}
                        {c.aiAnalysis.autoResponse && (
                          <div style={{ padding:'10px 14px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:10 }}>
                            <p style={{ fontSize:10, color:'#34d399', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>💬 Auto Response</p>
                            <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6, fontStyle:'italic' }}>"{c.aiAnalysis.autoResponse}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ paddingLeft:60, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <button onClick={() => handleAnalyze(c)} disabled={analyzing === c._id}
                      className="btn btn-secondary" style={{ padding:'7px 14px', fontSize:12 }}>
                      {analyzing === c._id ? <><LoadingSpinner size="sm" /> Analyzing...</> : `🤖 ${c.aiAnalysis?.priority ? 'Re-analyze' : 'AI Analyze'}`}
                    </button>
                    <button onClick={() => setExpanded(isExpanded ? null : c._id)}
                      style={{ padding:'7px 14px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b', fontFamily:'Inter, sans-serif', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#a5b4fc' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b' }}>
                      {isExpanded ? '▲ Collapse' : '▼ View Details'}
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="btn btn-danger" style={{ padding:'7px 14px', fontSize:12, marginLeft:'auto' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isSearch && pagination.pages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:28 }}>
          <button onClick={() => setFilter('page', filters.page-1)} disabled={filters.page===1}
            className="btn btn-secondary" style={{ padding:'8px 18px', fontSize:12, opacity: filters.page===1 ? 0.4 : 1 }}>← Prev</button>
          {Array.from({length: pagination.pages}, (_,i) => i+1).map(p => (
            <button key={p} onClick={() => setFilter('page', p)} style={{
              width:36, height:36, borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer',
              background: filters.page===p ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255,255,255,0.04)',
              color: filters.page===p ? 'white' : '#64748b',
              border: `1px solid ${filters.page===p ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: filters.page===p ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
              transition:'all 0.2s', fontFamily:'Inter, sans-serif'
            }}>{p}</button>
          ))}
          <button onClick={() => setFilter('page', filters.page+1)} disabled={filters.page===pagination.pages}
            className="btn btn-secondary" style={{ padding:'8px 18px', fontSize:12, opacity: filters.page===pagination.pages ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  )
}
