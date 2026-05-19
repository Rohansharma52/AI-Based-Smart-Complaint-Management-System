import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <p style={{ color: '#a5b4fc', fontSize: 12, fontWeight: 700 }}>{label}</p>
      <p style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>{payload[0].value} complaints</p>
    </div>
  )
  return null
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([complaintAPI.getStats(), complaintAPI.getAll({ limit: 6, sort: '-createdAt' })])
      .then(([s, c]) => { setStats(s.data); setRecent(c.data || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner size="lg" text="Loading admin dashboard..." />
    </div>
  )

  const pieData = [
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'In Progress', value: stats?.inProgress || 0 },
    { name: 'Resolved', value: stats?.resolved || 0 },
  ]

  const statCards = [
    { label: 'Total Complaints', value: stats?.total||0, icon: '📋', color: '#6366f1', cls: 'purple' },
    { label: 'Pending', value: stats?.pending||0, icon: '⏳', color: '#f59e0b', cls: 'amber' },
    { label: 'In Progress', value: stats?.inProgress||0, icon: '🔄', color: '#3b82f6', cls: 'blue' },
    { label: 'Resolved', value: stats?.resolved||0, icon: '✅', color: '#10b981', cls: 'green' },
  ]

  return (
    <div className="page page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 4 }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Welcome, {user?.username} — Manage all complaints</p>
        </div>
        <Link to="/admin/complaints" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          📋 Manage Complaints
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.cls} anim-fade-up`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: `0 4px 12px ${s.color}20` }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white' }}>{s.value}</div>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>{s.label}</p>
            <div style={{ marginTop: 12, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: stats?.total > 0 ? `${(s.value/stats.total)*100}%` : '0%', background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 2, transition: 'width 1.2s ease', boxShadow: `0 0 8px ${s.color}` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.7fr', gap: 20, marginBottom: 28 }}>

        {/* Bar Chart */}
        <div className="card anim-fade-up" style={{ padding: 24, animationDelay: '0.2s', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 20 }}>📊 Complaints by Category</h3>
          {stats?.byCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byCategory.map(c => ({ name: c._id?.split(' ')[0], count: c.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {stats.byCategory.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>No data yet</div>}
        </div>

        {/* Status bars */}
        <div className="card anim-fade-up" style={{ padding: 24, animationDelay: '0.25s' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 20 }}>📈 Status Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Pending', value: stats?.pending||0, color: '#f59e0b' },
              { label: 'In Progress', value: stats?.inProgress||0, color: '#3b82f6' },
              { label: 'Resolved', value: stats?.resolved||0, color: '#10b981' },
            ].map((s, i) => {
              const pct = stats?.total > 0 ? Math.round((s.value/stats.total)*100) : 0
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>{s.value} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 4, transition: 'width 1.2s ease', boxShadow: `0 0 10px ${s.color}60` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resolution rate */}
          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#34d399' }}>
              {stats?.total > 0 ? Math.round((stats.resolved/stats.total)*100) : 0}%
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Resolution Rate</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card anim-fade-up" style={{ padding: 24, animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 16 }}>🥧 Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {pieData.map((_,i) => <Cell key={i} fill={['#f59e0b','#3b82f6','#10b981'][i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: 'white', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[['Pending','#f59e0b'], ['In Progress','#3b82f6'], ['Resolved','#10b981']].map(([l,c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="card anim-fade-up" style={{ padding: 24, animationDelay: '0.35s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>🕐 Recent Complaints</h3>
          <Link to="/admin/complaints" style={{ color: '#818cf8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                {['User','Title','Category','Location','Priority','Status'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#334155' }}>No complaints yet</td></tr>
              ) : recent.map((c, i) => (
                <tr key={c._id} className="anim-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'white', fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                  <td><span className="badge badge-cat">{c.category}</span></td>
                  <td style={{ color: '#64748b' }}>📍 {c.location}</td>
                  <td>{c.aiAnalysis?.priority ? <span className={`badge badge-${c.aiAnalysis.priority.toLowerCase()}`}>{c.aiAnalysis.priority}</span> : <span style={{ color: '#334155' }}>—</span>}</td>
                  <td><span className={`badge badge-${c.status==='Pending'?'pending':c.status==='In Progress'?'progress':'resolved'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
