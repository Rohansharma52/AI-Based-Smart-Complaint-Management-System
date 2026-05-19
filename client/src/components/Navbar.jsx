import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const userLinks = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/my-complaints', icon: '📋', label: 'My Complaints' },
    { to: '/register-complaint', icon: '➕', label: 'New Complaint' },
  ]
  const adminLinks = [
    { to: '/admin/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/admin/complaints', icon: '📋', label: 'All Complaints' },
    { to: '/admin/analytics', icon: '📊', label: 'Analytics' },
  ]

  const navLinks = user?.role === 'admin' ? adminLinks : userLinks
  const isActive = (path) => location.pathname === path
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(8,8,18,0.97)' : 'rgba(8,8,18,0.85)',
      backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}`,
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.05)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, boxShadow: '0 0 20px rgba(99,102,241,0.5)',
              transition: 'all 0.3s ease'
            }}>🏛️</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>SmartComplaint</div>
              <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Management</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hide-sm">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  background: isActive(link.to) ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: isActive(link.to) ? '#a5b4fc' : '#64748b',
                  border: `1px solid ${isActive(link.to) ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  boxShadow: isActive(link.to) ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                }}
                  onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' } }}>
                  <span style={{ fontSize: 14 }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                {/* User badge - clickable */}
                <div onClick={() => navigate(user.role === 'admin' ? '/admin/profile' : '/profile')}
                  className="hide-sm"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 13px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${user.role === 'admin' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)'}`,
                    transition: 'all 0.2s ease',
                    boxShadow: user.role === 'admin' ? '0 0 12px rgba(245,158,11,0.1)' : '0 0 12px rgba(99,102,241,0.1)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = user.role === 'admin' ? 'rgba(245,158,11,0.08)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    background: user.role === 'admin' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 13, fontWeight: 800,
                    boxShadow: user.role === 'admin' ? '0 0 10px rgba(245,158,11,0.4)' : '0 0 10px rgba(99,102,241,0.4)'
                  }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{user.username}</div>
                    <div style={{ fontSize: 10, color: user.role === 'admin' ? '#fbbf24' : '#818cf8', textTransform: 'capitalize', lineHeight: 1 }}>{user.role}</div>
                  </div>
                </div>

                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171', fontSize: 12, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.boxShadow = 'none' }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 12 }}>Login</Link>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>Sign Up</Link>
              </div>
            )}

            {/* Mobile toggle */}
            {user && (
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{
                display: 'none', padding: '8px 10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b', cursor: 'pointer', fontSize: 16, fontFamily: 'Inter, sans-serif'
              }} className="show-sm">
                {mobileOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && user && (
          <div style={{ padding: '12px 0 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="anim-fade-in">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px',
                borderRadius: 10, textDecoration: 'none', marginBottom: 4, fontSize: 13, fontWeight: 500,
                background: isActive(link.to) ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: isActive(link.to) ? '#a5b4fc' : '#64748b', transition: 'all 0.2s'
              }}>
                <span>{link.icon}</span>{link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-sm { display: none !important; } .show-sm { display: flex !important; } }
        @media (min-width: 769px) { .show-sm { display: none !important; } }
      `}</style>
    </nav>
  )
}
