import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintAPI, aiAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const CATEGORIES = ['Water Supply','Electricity','Roads','Sanitation','Public Safety','Healthcare','Education','Other']
const ICONS = { 'Water Supply':'💧','Electricity':'⚡','Roads':'🛣️','Sanitation':'🗑️','Public Safety':'🛡️','Healthcare':'🏥','Education':'📚','Other':'📌' }
const CAT_COLORS = { 'Water Supply':'#3b82f6','Electricity':'#f59e0b','Roads':'#8b5cf6','Sanitation':'#10b981','Public Safety':'#ef4444','Healthcare':'#ec4899','Education':'#06b6d4','Other':'#64748b' }

export default function RegisterComplaint() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.username || '', email: user?.email || '', title: '', description: '', category: '', location: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [done, setDone] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.title.trim()) e.title = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    else if (form.description.length < 20) e.description = 'Min 20 characters'
    if (!form.category) e.category = 'Please select a category'
    if (!form.location.trim()) e.location = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAnalyze = async () => {
    if (!form.title || !form.description) { toast.error('Fill title & description first'); return }
    setAiLoading(true)
    try {
      const res = await aiAPI.analyze({ title: form.title, description: form.description, category: form.category, location: form.location })
      setAiResult(res.data)
      toast.success('AI analysis complete! ✅')
    } catch (err) { toast.error(err.message) }
    finally { setAiLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await complaintAPI.add(form)
      if (aiResult && res.data?._id) await complaintAPI.update(res.data._id, { aiAnalysis: aiResult })
      toast.success('Complaint registered! 🎉')
      setDone(true)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div className="card anim-scale-in" style={{ padding:'48px 40px', maxWidth:480, width:'100%', textAlign:'center', boxShadow:'0 0 60px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize:64, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>✅</div>
        <h2 style={{ fontSize:24, fontWeight:900, color:'white', marginBottom:8 }}>Complaint Registered!</h2>
        <p style={{ color:'#64748b', fontSize:14, marginBottom:24, lineHeight:1.6 }}>Your complaint has been submitted and will be reviewed shortly.</p>
        {aiResult && (
          <div style={{ padding:'16px', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14, marginBottom:24, textAlign:'left' }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#a5b4fc', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>🤖 AI Analysis</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
              <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background: aiResult.priority==='High'?'rgba(239,68,68,0.15)':'rgba(245,158,11,0.15)', color: aiResult.priority==='High'?'#f87171':'#fbbf24', border:`1px solid ${aiResult.priority==='High'?'rgba(239,68,68,0.3)':'rgba(245,158,11,0.3)'}` }}>
                {aiResult.priority==='High'?'🔴':'🟡'} {aiResult.priority} Priority
              </span>
              <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:'rgba(99,102,241,0.12)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.25)' }}>
                🏛️ {aiResult.department}
              </span>
            </div>
            {aiResult.autoResponse && <p style={{ fontSize:12, color:'#64748b', fontStyle:'italic', lineHeight:1.6 }}>"{aiResult.autoResponse}"</p>}
          </div>
        )}
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => { setDone(false); setForm({ name:user?.username||'', email:user?.email||'', title:'', description:'', category:'', location:'' }); setAiResult(null) }}
            className="btn btn-secondary" style={{ flex:1, padding:'12px' }}>File Another</button>
          <button onClick={() => navigate('/my-complaints')} className="btn btn-primary" style={{ flex:1, padding:'12px' }}>My Complaints</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page page-enter">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:'white', marginBottom:6 }}>
          Register <span className="gradient-text">Complaint</span>
        </h1>
        <p style={{ color:'#64748b', fontSize:14 }}>Fill in the details. AI will analyze your complaint automatically.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24, alignItems:'start' }}>

        {/* ── Form ── */}
        <div className="card" style={{ padding:28 }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:22 }}>

            {/* Name + Email */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label className="label">Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                <input className={`input ${errors.name ? 'error' : ''}`} placeholder="Your full name"
                  value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <p style={{ color:'#f87171', fontSize:12, marginTop:5 }}>⚠ {errors.name}</p>}
              </div>
              <div>
                <label className="label">Email Address <span style={{ color:'#ef4444' }}>*</span></label>
                <input type="email" className={`input ${errors.email ? 'error' : ''}`} placeholder="your@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <p style={{ color:'#f87171', fontSize:12, marginTop:5 }}>⚠ {errors.email}</p>}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label">Complaint Title <span style={{ color:'#ef4444' }}>*</span></label>
              <input className={`input ${errors.title ? 'error' : ''}`} placeholder="Brief title of your complaint"
                value={form.title} onChange={e => set('title', e.target.value)} />
              {errors.title && <p style={{ color:'#f87171', fontSize:12, marginTop:5 }}>⚠ {errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">
                Description <span style={{ color:'#ef4444' }}>*</span>
                <span style={{ color:'#334155', fontWeight:400, textTransform:'none', letterSpacing:0, marginLeft:6 }}>(min 20 chars)</span>
              </label>
              <textarea className={`input ${errors.description ? 'error' : ''}`} rows={4}
                placeholder="Describe the issue in detail — location, severity, how long it's been happening..."
                value={form.description} onChange={e => set('description', e.target.value)}
                style={{ resize:'vertical', minHeight:110 }} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                {errors.description ? <p style={{ color:'#f87171', fontSize:12 }}>⚠ {errors.description}</p> : <span />}
                <span style={{ fontSize:11, color: form.description.length >= 20 ? '#10b981' : '#475569' }}>{form.description.length} chars</span>
              </div>
            </div>

            {/* Category Grid */}
            <div>
              <label className="label">Category <span style={{ color:'#ef4444' }}>*</span></label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                {CATEGORIES.map(cat => {
                  const col = CAT_COLORS[cat]
                  const isSelected = form.category === cat
                  return (
                    <button key={cat} type="button" onClick={() => set('category', cat)} style={{
                      padding:'14px 8px', borderRadius:14, cursor:'pointer', textAlign:'center',
                      background: isSelected ? `${col}18` : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${isSelected ? col + '50' : 'rgba(255,255,255,0.07)'}`,
                      color: isSelected ? col : '#475569',
                      transition:'all 0.2s ease', fontFamily:'Inter, sans-serif',
                      boxShadow: isSelected ? `0 0 16px ${col}25, 0 4px 12px rgba(0,0,0,0.2)` : 'none',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                    }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background=`${col}10`; e.currentTarget.style.borderColor=`${col}30`; e.currentTarget.style.color=col } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#475569' } }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>{ICONS[cat]}</div>
                      <div style={{ fontSize:11, fontWeight:700, lineHeight:1.3 }}>{cat}</div>
                    </button>
                  )
                })}
              </div>
              {errors.category && <p style={{ color:'#f87171', fontSize:12, marginTop:8 }}>⚠ {errors.category}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="label">Location <span style={{ color:'#ef4444' }}>*</span></label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>📍</span>
                <input className={`input ${errors.location ? 'error' : ''}`} placeholder="e.g. Ghaziabad, Sector 5, Near Market"
                  value={form.location} onChange={e => set('location', e.target.value)}
                  style={{ paddingLeft:44 }} />
              </div>
              {errors.location && <p style={{ color:'#f87171', fontSize:12, marginTop:5 }}>⚠ {errors.location}</p>}
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:12, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <button type="button" onClick={handleAnalyze} disabled={aiLoading}
                className="btn btn-secondary" style={{ padding:'12px 20px' }}>
                {aiLoading ? <><LoadingSpinner size="sm" /> Analyzing...</> : '🤖 AI Analyze'}
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex:1, padding:'12px' }}>
                {loading ? <><LoadingSpinner size="sm" /> Submitting...</> : '📤 Submit Complaint'}
              </button>
            </div>
          </form>
        </div>

        {/* ── AI Panel ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:90 }}>

          {/* AI Result */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
              <div>
                <h3 style={{ fontSize:14, fontWeight:800, color:'white', margin:0 }}>AI Analysis</h3>
                <p style={{ fontSize:11, color:'#475569', margin:0 }}>Powered by GPT-3.5</p>
              </div>
            </div>

            {!aiResult && !aiLoading && (
              <div style={{ textAlign:'center', padding:'28px 16px' }}>
                <div style={{ fontSize:44, marginBottom:12, animation:'float 3s ease-in-out infinite' }}>🧠</div>
                <p style={{ color:'#334155', fontSize:13, lineHeight:1.6 }}>Fill the form and click "AI Analyze" to get instant priority detection and department routing</p>
              </div>
            )}

            {aiLoading && (
              <div style={{ textAlign:'center', padding:'28px 16px' }}>
                <LoadingSpinner size="md" text="AI analyzing your complaint..." />
              </div>
            )}

            {aiResult && !aiLoading && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }} className="anim-fade-in">
                {/* Priority */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:12 }}>
                  <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>Priority</span>
                  <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, background: aiResult.priority==='High'?'rgba(239,68,68,0.15)':aiResult.priority==='Medium'?'rgba(245,158,11,0.15)':'rgba(16,185,129,0.15)', color: aiResult.priority==='High'?'#f87171':aiResult.priority==='Medium'?'#fbbf24':'#34d399', border:`1px solid ${aiResult.priority==='High'?'rgba(239,68,68,0.3)':aiResult.priority==='Medium'?'rgba(245,158,11,0.3)':'rgba(16,185,129,0.3)'}` }}>
                    {aiResult.priority==='High'?'🔴':aiResult.priority==='Medium'?'🟡':'🟢'} {aiResult.priority}
                  </span>
                </div>
                {/* Department */}
                <div style={{ padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:12 }}>
                  <p style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Department</p>
                  <p style={{ fontSize:13, color:'white', fontWeight:700 }}>🏛️ {aiResult.department}</p>
                </div>
                {/* Summary */}
                {aiResult.summary && (
                  <div style={{ padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:12 }}>
                    <p style={{ fontSize:11, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>📝 Summary</p>
                    <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6 }}>{aiResult.summary}</p>
                  </div>
                )}
                {/* Auto Response */}
                {aiResult.autoResponse && (
                  <div style={{ padding:'12px 14px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:12 }}>
                    <p style={{ fontSize:11, color:'#34d399', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>💬 Auto Response</p>
                    <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6, fontStyle:'italic' }}>"{aiResult.autoResponse}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="card" style={{ padding:20 }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>💡 How It Works</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Fill complaint details','Click AI Analyze','Review AI results','Submit complaint','Track status in My Complaints'].map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#64748b' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#818cf8', flexShrink:0 }}>{i+1}</div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`@media(max-width:900px){ .reg-grid{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
