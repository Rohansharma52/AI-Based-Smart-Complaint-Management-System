import React, { useEffect, useState } from 'react'
import { complaintAPI } from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background:'rgba(8,8,18,0.97)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
      <p style={{ color:'#a5b4fc', fontSize:12, fontWeight:700, marginBottom:3 }}>{label}</p>
      <p style={{ color:'white', fontSize:14, fontWeight:800 }}>{payload[0].value} complaints</p>
    </div>
  )
  return null
}

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([complaintAPI.getStats(), complaintAPI.getAll({ limit: 200 })])
      .then(([s, c]) => { setStats(s.data); setComplaints(c.data || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <LoadingSpinner size="lg" text="Loading analytics..." />
    </div>
  )

  const priorityData = [
    { name: 'High', value: complaints.filter(c => c.aiAnalysis?.priority === 'High').length, color:'#ef4444' },
    { name: 'Medium', value: complaints.filter(c => c.aiAnalysis?.priority === 'Medium').length, color:'#f59e0b' },
    { name: 'Low', value: complaints.filter(c => c.aiAnalysis?.priority === 'Low').length, color:'#10b981' },
    { name: 'Not Analyzed', value: complaints.filter(c => !c.aiAnalysis?.priority).length, color:'#334155' },
  ]

  const statusData = [
    { name: 'Pending', value: stats?.pending || 0, color:'#f59e0b' },
    { name: 'In Progress', value: stats?.inProgress || 0, color:'#3b82f6' },
    { name: 'Resolved', value: stats?.resolved || 0, color:'#10b981' },
  ]

  const resolutionRate = stats?.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0

  const kpis = [
    { label:'Total Complaints', value: stats?.total||0, icon:'📋', sub:'All time', color:'#6366f1' },
    { label:'Resolution Rate', value: `${resolutionRate}%`, icon:'✅', sub:'Resolved/Total', color:'#10b981' },
    { label:'Pending Rate', value: stats?.total > 0 ? `${Math.round((stats.pending/stats.total)*100)}%` : '0%', icon:'⏳', sub:'Needs attention', color:'#f59e0b' },
    { label:'AI Analyzed', value: complaints.filter(c => c.aiAnalysis?.priority).length, icon:'🤖', sub:'AI processed', color:'#8b5cf6' },
  ]

  // Top locations
  const locCount = {}
  complaints.forEach(c => { locCount[c.location] = (locCount[c.location]||0)+1 })
  const topLocations = Object.entries(locCount).sort((a,b)=>b[1]-a[1]).slice(0,6)
  const maxLoc = topLocations[0]?.[1] || 1

  return (
    <div className="page page-enter">

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:'white', marginBottom:4 }}>
          📊 <span className="gradient-text">Analytics</span>
        </h1>
        <p style={{ color:'#64748b', fontSize:13 }}>Complaint management insights and statistics</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:28 }}>
        {kpis.map((k, i) => (
          <div key={i} className={`stat-card anim-fade-up`} style={{ animationDelay:`${i*0.07}s` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${k.color}18`, border:`1px solid ${k.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{k.icon}</div>
              <div style={{ fontSize:28, fontWeight:900, color:'white' }}>{k.value}</div>
            </div>
            <p style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:2 }}>{k.label}</p>
            <p style={{ fontSize:11, color:'#475569' }}>{k.sub}</p>
            <div style={{ marginTop:10, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'60%', background:`linear-gradient(90deg, ${k.color}, ${k.color}60)`, borderRadius:2, boxShadow:`0 0 8px ${k.color}` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* Category Bar */}
        <div className="card anim-fade-up" style={{ padding:24, animationDelay:'0.2s' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:'white', marginBottom:20 }}>📊 Complaints by Category</h3>
          {stats?.byCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.byCategory.map(c => ({ name: c._id?.split(' ')[0], count: c.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill:'#475569', fontSize:11 }} />
                <YAxis tick={{ fill:'#475569', fontSize:11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {stats.byCategory.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#334155', fontSize:13 }}>No data yet</div>}
        </div>

        {/* Priority Pie */}
        <div className="card anim-fade-up" style={{ padding:24, animationDelay:'0.25s' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:'white', marginBottom:20 }}>🎯 Priority Distribution</h3>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {priorityData.map((p,i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'rgba(8,8,18,0.97)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:8, color:'white', fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {priorityData.map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:p.color, boxShadow:`0 0 6px ${p.color}`, flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:12, color:'white', fontWeight:700 }}>{p.value}</div>
                    <div style={{ fontSize:10, color:'#475569' }}>{p.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Status Progress */}
        <div className="card anim-fade-up" style={{ padding:24, animationDelay:'0.3s' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:'white', marginBottom:20 }}>📈 Status Overview</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {statusData.map((s, i) => {
              const pct = stats?.total > 0 ? Math.round((s.value/stats.total)*100) : 0
              return (
                <div key={i}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:13, color:'#94a3b8', fontWeight:600 }}>{s.name}</span>
                    <span style={{ fontSize:13, color:'white', fontWeight:800 }}>{s.value} <span style={{ color:'#475569', fontWeight:400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height:8, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius:4, transition:'width 1.2s ease', boxShadow:`0 0 10px ${s.color}60` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resolution rate big number */}
          <div style={{ marginTop:24, padding:'18px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:14, textAlign:'center' }}>
            <div style={{ fontSize:40, fontWeight:900, color:'#34d399', lineHeight:1 }}>{resolutionRate}%</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>Overall Resolution Rate</div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="card anim-fade-up" style={{ padding:24, animationDelay:'0.35s' }}>
          <h3 style={{ fontSize:14, fontWeight:800, color:'white', marginBottom:20 }}>📍 Top Complaint Locations</h3>
          {topLocations.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {topLocations.map(([loc, count], i) => (
                <div key={loc}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%' }}>📍 {loc}</span>
                    <span style={{ fontSize:12, color:'white', fontWeight:800, flexShrink:0 }}>{count}</span>
                  </div>
                  <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(count/maxLoc)*100}%`, background:`linear-gradient(90deg, ${COLORS[i%COLORS.length]}, ${COLORS[i%COLORS.length]}80)`, borderRadius:3, transition:'width 1s ease', boxShadow:`0 0 8px ${COLORS[i%COLORS.length]}50` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'40px 20px', color:'#334155', fontSize:13 }}>No location data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
