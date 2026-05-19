import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export default function UserProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passLoading, setPassLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) { toast.error('Passwords do not match'); return }
    if (passForm.newPassword.length < 6) { toast.error('Min 6 characters'); return }
    setPassLoading(true)
    try {
      const token = localStorage.getItem('complaint_token')
      await axios.put('/api/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally { setPassLoading(false) }
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  const tabs = [
    { key: 'profile', label: '👤 Profile Info' },
    { key: 'security', label: '🔒 Security' },
    { key: 'account', label: '⚙️ Account' },
  ]

  return (
    <div className="page page-enter" style={{ maxWidth: 720 }}>

      {/* ── Header ── */}
      <div className="card" style={{ padding: 28, marginBottom: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: 'white', boxShadow: '0 6px 24px rgba(99,102,241,0.45)', flexShrink: 0 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 4 }}>{user?.username}</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>👤 User</span>
              <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✅ Active</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '10px 18px', flexShrink: 0 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 5, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 10, border: tab === t.key ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            background: tab === t.key ? 'rgba(99,102,241,0.18)' : 'transparent',
            color: tab === t.key ? '#a5b4fc' : '#64748b',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            boxShadow: tab === t.key ? '0 0 12px rgba(99,102,241,0.15)' : 'none'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'profile' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 20 }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Username', value: user?.username, icon: '👤' },
              { label: 'Email Address', value: user?.email, icon: '✉️' },
              { label: 'Role', value: 'User', icon: '🎭' },
              { label: 'Member Since', value: joinDate, icon: '📅' },
              { label: 'Account Status', value: 'Active', icon: '✅' },
              { label: 'User ID', value: user?._id?.slice(-8)?.toUpperCase(), icon: '🆔' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{item.icon} {item.label}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {tab === 'security' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 20 }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 440 }}>
            {[
              { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
              { key: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
              { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className="input"
                    placeholder={f.placeholder} value={passForm[f.key]}
                    onChange={e => setPassForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={passLoading} style={{ alignSelf: 'flex-start', padding: '11px 24px' }}>
              {passLoading ? <><LoadingSpinner size="sm" /> Changing...</> : '🔒 Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* ── Account Tab ── */}
      {tab === 'account' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 20 }}>Account Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '🆔', label: 'User ID', value: user?._id },
              { icon: '🎭', label: 'Account Type', value: 'Regular User' },
              { icon: '📅', label: 'Joined', value: joinDate },
              { icon: '🔐', label: 'Authentication', value: 'JWT Token Based' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: 'white', fontWeight: 600, marginTop: 3, wordBreak: 'break-all' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 18, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 6 }}>⚠️ Danger Zone</h4>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>Logging out will end your current session.</p>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '10px 20px' }}>🚪 Logout from SmartComplaint</button>
          </div>
        </div>
      )}
    </div>
  )
}
