import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { complaintAPI, aiAPI } from '../../services/api'
import { LoadingSpinner, SkeletonCard } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ICONS = { 'Water Supply':'💧','Electricity':'⚡','Roads':'🛣️','Sanitation':'🗑️','Public Safety':'🛡️','Healthcare':'🏥','Education':'📚','Other':'📌' }
const CAT_COLORS = { 'Water Supply':'#3b82f6','Electricity':'#f59e0b','Roads':'#8b5cf6','Sanitation':'#10b981','Public Safety':'#ef4444','Healthcare':'#ec4899','Education':'#06b6d4','Other':'#64748b' }
const CATEGORIES = ['All','Water Supply','Electricity','Roads','Sanitation','Public Safety','Healthcare','Education','Other']

export default function MyComplaints() {
  const [searchParams] = useSearchParams()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'All')
  const [expanded, setExpanded] = useState(null)
  const [analyzing, setAnalyzing] = useState(null)

  useEffect(() => {
    complaintAPI.getAll({ limit: 100 })
      .then(res => setComplaints(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAnalyze = async (c) => {
    setAnalyzing(c._id)
    try {
      const res = await aiAPI.analyze({ title: c.title, description: c.description, category: c.category, location: c.location, complaintId: c._id })
      setComplaints(prev => prev.map(x => x._id === c._id ? { ...x, aiAnalysis: res.data } : x))
      toast.success('AI analysis complete! 🤖')
    } catch (err) { toast.error(err.message) }
    finally { setAnalyzing(null) }
  }

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || c.category === catFilter
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const StatusBadge = ({ status }) => {
    const cfg = { 'Pending': { bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.3)', dot:'#f59e0b' }, 'In Progress': { bg:'rgba(59,130,246,0.12)', color:'#60a5fa', border:'rgba(59,130,246,0.3)', dot:'#3b82f6' }, 'Resolved': { bg:'rgba(16,185,129,0.12)', color:'#34d399', border:'rgba(16,185,129,0.3)', dot:'#10b981' } }[status] || {}
    return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}><span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, boxShadow:`0 0 6px ${cfg.dot}`, display:'inline-block' }} />{status}</span>
  }

  return (
    <div className="page page-enter">

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'white', marginBottom:4 }}>
            My <span className="gradient-text">Complaints</span>
          </h1>
          <p style={{ color:'#64748b', fontSize:13 }}>{filtered.length} of {complaints.length} complaints</p>
        </div>
        <Link to="/register-complaint" className="btn btn-primary" style={{ padding:'11px 22px' }}>
          ➕ New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:20, marginBottom:24 }}>
        {/* Search */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input className="input" placeholder="Search by title or location..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:44 }} />
        </div>
        {/* Chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Category</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`chip ${catFilter===c?'active':''}`}>
                {c !== 'All' && ICONS[c] ? `${ICONS[c]} ` : ''}{c}
              </button>
            ))}
          </div>
          <div style={{ width:1, height:22, background:'rgba(255,255,255,0.06)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Status</span>
            {['All','Pending','In Progress','Resolved'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`chip ${statusFilter===s?'active':''}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:'80px 20px', textAlign:'center' }}>
          <div style={{ fontSize:52, marginBottom:14, animation:'float 3s ease-in-out infinite' }}>📭</div>
          <h3 style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:8 }}>No complaints found</h3>
          <p style={{ color:'#64748b', marginBottom:20, fontSize:13 }}>
            {complaints.length === 0 ? 'You haven\'t filed any complaints yet' : 'Try adjusting your filters'}
          </p>
          <Link to="/register-complaint" className="btn btn-primary">File a Complaint</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {filtered.map((c, i) => {
            const catColor = CAT_COLORS[c.category] || '#6366f1'
            const isExp = expanded === c._id
            return (
              <div key={c._id} className="card anim-fade-up" style={{ padding:0, overflow:'hidden', animationDelay:`${i*0.05}s`, transition:'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow='0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(99,102,241,0.12)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.4)' }}>

                {/* Left accent */}
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:`linear-gradient(180deg, ${catColor}, ${catColor}60)`, borderRadius:'20px 0 0 20px' }} />

                <div style={{ padding:'20px 22px 20px 26px' }}>
                  {/* Top */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:12 }}>
                    <div style={{ width:46, height:46, borderRadius:14, background:`${catColor}18`, border:`1px solid ${catColor}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, boxShadow:`0 4px 12px ${catColor}20` }}>
                      {ICONS[c.category] || '📌'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                        <h3 style={{ fontSize:15, fontWeight:800, color:'white', margin:0 }}>{c.title}</h3>
                        <span style={{ padding:'2px 9px', borderRadius:8, fontSize:11, fontWeight:700, background:`${catColor}18`, color:catColor, border:`1px solid ${catColor}25` }}>{c.category}</span>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:10, fontSize:12, color:'#475569' }}>
                        <span>📍 <span style={{ color:'#94a3b8' }}>{c.location}</span></span>
                        <span>🗓️ <span style={{ color:'#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></span>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end', flexShrink:0 }}>
                      <StatusBadge status={c.status} />
                      {c.aiAnalysis?.priority && (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 11px', borderRadius:20, fontSize:11, fontWeight:700, background: c.aiAnalysis.priority==='High'?'rgba(239,68,68,0.12)':c.aiAnalysis.priority==='Medium'?'rgba(245,158,11,0.12)':'rgba(16,185,129,0.12)', color: c.aiAnalysis.priority==='High'?'#f87171':c.aiAnalysis.priority==='Medium'?'#fbbf24':'#34d399', border:`1px solid ${c.aiAnalysis.priority==='High'?'rgba(239,68,68,0.3)':c.aiAnalysis.priority==='Medium'?'rgba(245,158,11,0.3)':'rgba(16,185,129,0.3)'}` }}>
                          {c.aiAnalysis.priority==='High'?'🔴':c.aiAnalysis.priority==='Medium'?'🟡':'🟢'} {c.aiAnalysis.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.6, marginBottom:14, paddingLeft:60, display:'-webkit-box', WebkitLineClamp: isExp ? 'unset' : 2, WebkitBoxOrient:'vertical', overflow: isExp ? 'visible' : 'hidden' }}>
                    {c.description}
                  </p>

                  {/* AI Result expanded */}
                  {isExp && c.aiAnalysis?.priority && (
                    <div style={{ paddingLeft:60, marginBottom:14 }} className="anim-fade-in">
                      <div style={{ padding:'16px', background:'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.04))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                          <span style={{ fontSize:16 }}>🤖</span>
                          <span style={{ fontSize:11, fontWeight:800, color:'#a5b4fc', textTransform:'uppercase', letterSpacing:'0.06em' }}>AI Analysis Result</span>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                          <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                            <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>Priority</p>
                            <p style={{ fontSize:13, fontWeight:700, color: c.aiAnalysis.priority==='High'?'#f87171':c.aiAnalysis.priority==='Medium'?'#fbbf24':'#34d399' }}>{c.aiAnalysis.priority==='High'?'🔴':c.aiAnalysis.priority==='Medium'?'🟡':'🟢'} {c.aiAnalysis.priority}</p>
                          </div>
                          <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
                            <p style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>Department</p>
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
                            <p style={{ fontSize:10, color:'#34d399', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>💬 AI Response</p>
                            <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6, fontStyle:'italic' }}>"{c.aiAnalysis.autoResponse}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ paddingLeft:60, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <button onClick={() => handleAnalyze(c)} disabled={analyzing === c._id}
                      className="btn btn-secondary" style={{ padding:'7px 14px', fontSize:12 }}>
                      {analyzing === c._id ? <><LoadingSpinner size="sm" /> Analyzing...</> : `🤖 ${c.aiAnalysis?.priority ? 'Re-analyze' : 'AI Analyze'}`}
                    </button>
                    <button onClick={() => setExpanded(isExp ? null : c._id)}
                      style={{ padding:'7px 14px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b', fontFamily:'Inter, sans-serif', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.1)'; e.currentTarget.style.color='#a5b4fc' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#64748b' }}>
                      {isExp ? '▲ Collapse' : '▼ View Details'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
