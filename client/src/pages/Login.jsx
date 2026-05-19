import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = await login(form.email, form.password)
    setLoading(false)
    if (res.success) navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 10s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', opacity: 0.5 }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} className="anim-scale-in">

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, boxShadow: '0 0 30px rgba(99,102,241,0.5), 0 8px 24px rgba(0,0,0,0.3)',
            animation: 'float 3s ease-in-out infinite'
          }}>🔑</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to your SmartComplaint account</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32, boxShadow: '0 0 40px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>✉️</span>
                <input className={`input ${errors.email ? 'error' : ''}`} type="email"
                  placeholder="you@example.com" value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                  style={{ paddingLeft: 44 }} />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>⚠ {errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔒</span>
                <input className={`input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password" value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
                  style={{ paddingLeft: 44, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>⚠ {errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14, borderRadius: 12, marginTop: 4 }}>
              {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : '🔑 Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '20px 0' }}><span>or</span></div>

          {/* Demo credentials */}
          <button onClick={() => setForm({ email: 'admin@demo.com', password: 'admin123' })}
            style={{
              width: '100%', padding: '11px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
              color: '#fbbf24', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s', marginBottom: 8
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(245,158,11,0.15)'}
            onMouseLeave={e => e.target.style.background = 'rgba(245,158,11,0.08)'}>
            🧪 Fill Demo Admin Credentials
          </button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ color: '#64748b', fontSize: 13 }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>Create one →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
