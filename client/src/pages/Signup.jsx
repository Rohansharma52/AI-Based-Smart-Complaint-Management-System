import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'user' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const getStrength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++; if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strength = getStrength(form.password)
  const strengthData = [
    { label: '', color: '' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#06b6d4' },
    { label: 'Strong', color: '#10b981' },
    { label: 'Very Strong', color: '#10b981' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = await signup({ username: form.username, email: form.email, password: form.password, role: form.role })
    setLoading(false)
    if (res.success) navigate(form.role === 'admin' ? '/admin/dashboard' : '/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 10s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', opacity: 0.5 }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} className="anim-scale-in">

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, boxShadow: '0 0 30px rgba(99,102,241,0.5), 0 8px 24px rgba(0,0,0,0.3)',
            animation: 'float 3s ease-in-out infinite'
          }}>🚀</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Join SmartComplaint AI today</p>
        </div>

        <div className="card" style={{ padding: 32, boxShadow: '0 0 40px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Username */}
            <div>
              <label className="label">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>👤</span>
                <input className={`input ${errors.username ? 'error' : ''}`} placeholder="Your username"
                  value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: '' }) }}
                  style={{ paddingLeft: 44 }} />
              </div>
              {errors.username && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>⚠ {errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>✉️</span>
                <input className={`input ${errors.email ? 'error' : ''}`} type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                  style={{ paddingLeft: 44 }} />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>⚠ {errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="label">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'user', icon: '👤', label: 'User', desc: 'File complaints' },
                  { value: 'admin', icon: '⚙️', label: 'Admin', desc: 'Manage system' },
                ].map(r => (
                  <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      padding: '12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                      background: form.role === r.value ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${form.role === r.value ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: form.role === r.value ? '#a5b4fc' : '#64748b',
                      transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                      boxShadow: form.role === r.value ? '0 0 16px rgba(99,102,241,0.2)' : 'none'
                    }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔒</span>
                <input className={`input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
                  style={{ paddingLeft: 44, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength * 20}%`, background: strengthData[strength].color, borderRadius: 2, transition: 'all 0.3s ease', boxShadow: `0 0 8px ${strengthData[strength].color}` }} />
                  </div>
                  <span style={{ fontSize: 11, color: strengthData[strength].color, fontWeight: 700, minWidth: 70 }}>{strengthData[strength].label}</span>
                </div>
              )}
              {errors.password && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>⚠ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔐</span>
                <input className={`input ${errors.confirmPassword ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'} placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }) }}
                  style={{ paddingLeft: 44, paddingRight: 44 }} />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontSize: 18, fontWeight: 700 }}>✓</span>
                )}
              </div>
              {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>⚠ {errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14, borderRadius: 12, marginTop: 4 }}>
              {loading ? <><LoadingSpinner size="sm" /> Creating account...</> : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ color: '#64748b', fontSize: 13 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
