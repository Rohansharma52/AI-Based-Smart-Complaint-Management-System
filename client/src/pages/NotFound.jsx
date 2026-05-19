import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 6s ease-in-out infinite' }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }} className="anim-scale-in">
        <div style={{ fontSize: 100, fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 16 }}>404</div>
        <div style={{ fontSize: 56, marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🔍</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 10 }}>Page Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>← Go Home</Link>
      </div>
    </div>
  )
}
