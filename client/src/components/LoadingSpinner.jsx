import React from 'react'

export function LoadingSpinner({ size = 'md', text = '' }) {
  const s = { sm: 16, md: 32, lg: 52 }[size]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: s, height: s, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${size === 'sm' ? 2 : 3}px solid rgba(99,102,241,0.15)`, borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ position: 'absolute', inset: size === 'sm' ? 3 : 5, borderRadius: '50%', border: `${size === 'sm' ? 1 : 2}px solid rgba(6,182,212,0.15)`, borderRightColor: '#06b6d4', animation: 'spin 0.5s linear infinite reverse' }} />
      </div>
      {text && <p style={{ color: '#475569', fontSize: 13, animation: 'pulse 2s ease-in-out infinite' }}>{text}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

export function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#080812', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>🏛️</div>
      <LoadingSpinner size="lg" text="Loading SmartComplaint..." />
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div style={{ background: 'rgba(15,15,30,0.85)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 20, padding: 22 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 11, width: '45%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 11, width: '100%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 11, width: '80%', marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
      </div>
    </div>
  )
}
