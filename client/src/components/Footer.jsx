import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(8,8,18,0.9)', borderTop: '1px solid rgba(99,102,241,0.1)', marginTop: 'auto', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '20%', width: 300, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>🏛️</div>
              <span style={{ fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartComplaint AI</span>
            </div>
            <p style={{ color: '#334155', fontSize: 12, lineHeight: 1.7 }}>AI-powered complaint management system for smart governance and citizen services.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['/', 'Home'], ['/complaints', 'View Complaints'], ['/register-complaint', 'File Complaint']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: '#334155', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#818cf8'}
                  onMouseLeave={e => e.target.style.color = '#334155'}>
                  → {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['React', 'Node.js', 'MongoDB', 'Express', 'AI/GPT', 'JWT', 'Vite', 'Tailwind'].map(tech => (
                <span key={tech} style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, fontSize: 11, color: '#6366f1', fontWeight: 600 }}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, textAlign: 'center', color: '#1e293b', fontSize: 12 }}>
          © 2026 SmartComplaint AI — B.Tech 4th Semester ESE | AI Driven Full Stack Development (AI308B)
        </div>
      </div>
    </footer>
  )
}
