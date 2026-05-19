import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { complaintAPI } from '../../services/api'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export default function AdminProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [stats, setStats] = useState(null)
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passLoading, setPassLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    complaintAPI.getStats().then(res => setStats(res.data)).catch(console.error)
  }, [])

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
      toast.success('Password changed!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally { setPassLoading(false) }
  }

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

  return (
    <div className="page page-enter" style={{ maxWidth: 800 }}>
      {/* Admin Header */}
      <div className="card" style={{ padding: 28, marginBottom: 20, background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(99,102,241,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 900, color: 'white',
            boxShadow: '0 6px 20px rgba(245,158,11,0.4)', flexShrink: 0
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{user?.username}</h2>
              <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                ⚙️ ADMIN
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                ✅ Active
              </span>
              <span style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                🔐 Full Access
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12, color: '#f87171', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📋', label: 'Total', value: stats.total, color: '#6366f1' },
            { icon: '⏳', label: 'Pending', value: stats.pending, color: '#f59e0b' },
            { icon: '🔄', label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
            { icon: '✅', label: 'Resolved', value: stats.resolved, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '14px 16px', borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 5, marginBottom: 20 }}>
        {[
          { key: 'profile', label: '⚙️ Admin Info' },
          { key: 'security', label: '🔒 Security' },
          { key: 'account', label: '📊 Account' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none',
            background: tab === t.key ? 'rgba(245,158,11,0.15)' : 'transparent',
            color: tab === t.key ? '#fbbf24' : '#64748b',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            outline: tab === t.key ? '1px solid rgba(245,158,11,0.3)' : 'none',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 20 }}>Administrator Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Admin Username', value: user?.username, icon: '👤' },
              { label: 'Email Address', value: user?.email, icon: '✉️' },
              { label: 'Role', value: 'Administrator', icon: '⚙️' },
              { label: 'Access Level', value: 'Full System Access', icon: '🔐' },
              { label: 'Member Since', value: joinDate, icon: '📅' },
              { label: 'Admin ID', value: user?._id?.slice(-8)?.toUpperCase(), icon: '🆔' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 12 }}>
                <p style={{ fontSize: 11, color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {item.icon} {item.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Permissions */}
          <div style={{ marginTop: 20, padding: 16, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>🔑 Admin Permissions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['View all complaints', 'Update complaint status', 'Delete complaints', 'AI analyze complaints', 'View analytics', 'Manage users'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ color: '#34d399' }}>✓</span> {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 20 }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <button type="submit" className="btn btn-primary" disabled={passLoading} style={{ alignSelf: 'flex-start' }}>
              {passLoading ? <><LoadingSpinner size="sm" /> Changing...</> : '🔒 Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* Account Tab */}
      {tab === 'account' && (
        <div className="card anim-fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 20 }}>Account Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '🆔', label: 'Admin ID', value: user?._id },
              { icon: '🎭', label: 'Account Type', value: 'System Administrator' },
              { icon: '📅', label: 'Joined', value: joinDate },
              { icon: '🔐', label: 'Authentication', value: 'JWT Token Based' },
              { icon: '📊', label: 'Total Managed', value: `${stats?.total || 0} complaints` },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: 'white', fontWeight: 600, marginTop: 2, wordBreak: 'break-all' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 6 }}>⚠️ Danger Zone</h4>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>Logging out will end your admin session.</p>
            <button onClick={handleLogout} className="btn btn-danger">🚪 Logout from Admin Panel</button>
          </div>
        </div>
      )}
    </div>
  )
}
