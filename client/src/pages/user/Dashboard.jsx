import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const ICONS = { 'Water Supply':'💧','Electricity':'⚡','Roads':'🛣️','Sanitation':'🗑️','Public Safety':'🛡️','Healthcare':'🏥','Education':'📚','Other':'📌' }

export default function UserDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.getAll({ limit: 100 })
      .then(res => setComplaints(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = complaints.length
  const pending = complaints.filter(c => c.status === 'Pending').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved = complaints.filter(c => c.status === 'Resolved').length
  const recent = [...complaints].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5)

  if (loading) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  )

  const stats = [
    { label: 'Total Complaints', value: total, icon: '📋', color: '#6366f1', cls: 'purple' },
    { label: 'Pending', value: pending, icon: '⏳', color: '#f59e0b', cls: 'amber' },
    { label: 'In Progress', value: inProgress, icon: '🔄', color: '#3b82f6', cls: 'blue' },
    { label: 'Resolved', value: resolved, icon: '✅', color: '#10b981', cls: 'green' },
  ]

  return (
    <div className="page page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 4 }}>
            Welcome, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Track and manage your complaints from here</p>
        </div>
        <Link to="/register-complaint" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          ➕ Register New Complaint
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.cls} anim-fade-up`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: `${s.color}18`, border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: `0 4px 12px ${s.color}20`
              }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', animation: 'countUp 0.6s ease forwards', animationDelay: `${i * 0.1}s` }}>{s.value}</div>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>{s.label}</p>
            {/* Progress bar */}
            <div style={{ marginTop: 12, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: total > 0 ? `${(s.value/total)*100}%` : '0%', background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 2, transition: 'width 1s ease', boxShadow: `0 0 8px ${s.color}` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { to: '/register-complaint', icon: '📝', title: 'Register Complaint', desc: 'Submit a new civic complaint', grad: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))', border: 'rgba(99,102,241,0.25)' },
          { to: '/my-complaints', icon: '📋', title: 'My Complaints', desc: 'View and track all your complaints', grad: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))', border: 'rgba(6,182,212,0.25)' },
          { to: '/my-complaints?filter=Pending', icon: '⏳', title: 'Pending Issues', desc: `${pending} complaints awaiting action`, grad: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', border: 'rgba(245,158,11,0.25)' },
        ].map((item, i) => (
          <Link key={i} to={item.to} style={{ textDecoration: 'none' }}>
            <div className="card card-hover anim-fade-up" style={{ padding: 22, background: item.grad, border: `1px solid ${item.border}`, animationDelay: `${0.2 + i * 0.07}s`, cursor: 'pointer' }}>
              <div style={{ fontSize: 32, marginBottom: 12, animation: `float ${3 + i * 0.5}s ease-in-out infinite` }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>{item.title}</h3>
              <p style={{ color: '#64748b', fontSize: 12 }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="card anim-fade-up" style={{ padding: 24, animationDelay: '0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>🕐 Recent Complaints</h2>
          <Link to="/my-complaints" style={{ color: '#818cf8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>📭</div>
            <p style={{ color: '#64748b', marginBottom: 16 }}>No complaints yet</p>
            <Link to="/register-complaint" className="btn btn-primary">File Your First Complaint</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((c, i) => (
              <div key={c._id} className="anim-fade-up" style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 14, transition: 'all 0.2s ease', cursor: 'default',
                animationDelay: `${i * 0.06}s`
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  {ICONS[c.category] || '📌'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: 13, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                  <p style={{ color: '#475569', fontSize: 11 }}>📍 {c.location} • {new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <span className={`badge badge-${c.status === 'Pending' ? 'pending' : c.status === 'In Progress' ? 'progress' : 'resolved'}`}>{c.status}</span>
                  {c.aiAnalysis?.priority && <span className={`badge badge-${c.aiAnalysis.priority.toLowerCase()}`}>{c.aiAnalysis.priority}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
