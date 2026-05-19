import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '📝', title: 'Easy Registration', desc: 'Submit complaints in minutes with our smart form', color: '#6366f1' },
  { icon: '🤖', title: 'AI Analysis', desc: 'Instant priority detection and department routing', color: '#06b6d4' },
  { icon: '📊', title: 'Live Tracking', desc: 'Real-time status updates from Pending to Resolved', color: '#10b981' },
  { icon: '🏛️', title: 'Smart Routing', desc: 'AI recommends the right department automatically', color: '#f59e0b' },
  { icon: '💬', title: 'Auto Response', desc: 'Instant AI-generated acknowledgment for every complaint', color: '#8b5cf6' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication keeps your data protected', color: '#ef4444' },
]

const stats = [
  { value: '10K+', label: 'Complaints Resolved', icon: '✅' },
  { value: '98%', label: 'AI Accuracy', icon: '🎯' },
  { value: '48hrs', label: 'Avg Resolution', icon: '⚡' },
  { value: '8', label: 'Departments', icon: '🏛️' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ===== HERO ===== */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)', pointerEvents: 'none', animation: 'floatSlow 10s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div style={{ maxWidth: 900, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 50,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 32, fontSize: 13, fontWeight: 600, color: '#a5b4fc',
            boxShadow: '0 0 20px rgba(99,102,241,0.15)',
            animation: 'fadeUp 0.6s ease forwards'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            AI-Powered Smart Complaint Management System
          </div>

          {/* Headline */}
          <h1 className="anim-fade-up delay-1" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Resolve Civic Issues
            <br />
            <span className="gradient-text">Smarter & Faster</span>
          </h1>

          <p className="anim-fade-up delay-2" style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Register complaints online, get instant AI analysis, track status in real-time, and connect with the right government department automatically.
          </p>

          {/* CTA Buttons */}
          <div className="anim-fade-up delay-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/register-complaint'}
                  className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 14 }}>
                  {user.role === 'admin' ? '⚙️ Admin Dashboard' : '➕ File a Complaint'}
                </Link>
                <Link to={user.role === 'admin' ? '/admin/complaints' : '/my-complaints'}
                  className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 14 }}>
                  📋 View Complaints
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 14 }}>
                  🚀 Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 14 }}>
                  🔑 Login
                </Link>
              </>
            )}
          </div>

          {/* Floating cards preview */}
          <div className="anim-fade-up delay-4" style={{ marginTop: 60, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', label: 'High Priority', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
              { icon: '💧', label: 'Water Dept', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { icon: '🤖', label: 'AI Analyzed', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
              { icon: '✅', label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 12,
                background: item.bg, border: `1px solid ${item.color}30`,
                color: item.color, fontSize: 13, fontWeight: 600,
                boxShadow: `0 4px 16px ${item.color}20`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}>
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(99,102,241,0.02)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} className="anim-fade-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div className="gradient-text" style={{ fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="anim-fade-up" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
              Why <span className="gradient-text">SmartComplaint?</span>
            </h2>
            <p className="anim-fade-up delay-1" style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Everything you need for efficient civic complaint management
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="card card-hover anim-fade-up" style={{ padding: 28, animationDelay: `${i * 0.08}s`, cursor: 'default' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 18,
                  boxShadow: `0 4px 16px ${f.color}20`,
                  transition: 'all 0.3s ease'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: 16, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${f.color}60, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '80px 20px', background: 'rgba(99,102,241,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="anim-fade-up" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginBottom: 12 }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="anim-fade-up delay-1" style={{ color: '#64748b', marginBottom: 52, fontSize: 15 }}>Simple 4-step process</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Fill complaint form with details' },
              { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'AI detects priority & department' },
              { step: '03', icon: '🏛️', title: 'Routed', desc: 'Sent to right department' },
              { step: '04', icon: '✅', title: 'Resolved', desc: 'Track until resolved' },
            ].map((item, i) => (
              <div key={i} className="anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  padding: '28px 20px', borderRadius: 20,
                  background: 'rgba(15,15,30,0.8)',
                  border: '1px solid rgba(99,102,241,0.12)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  <div style={{
                    position: 'absolute', top: 12, right: 14,
                    fontSize: 11, fontWeight: 900, color: 'rgba(99,102,241,0.3)',
                    letterSpacing: '0.05em'
                  }}>{item.step}</div>
                  <div style={{ fontSize: 36, marginBottom: 14, animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{item.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                {i < 3 && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', color: 'rgba(99,102,241,0.3)', fontSize: 20 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="card anim-scale-in" style={{
            padding: '60px 40px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.06), rgba(245,158,11,0.04))',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.4)',
            animation: 'borderGlow 3s ease-in-out infinite'
          }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'floatSlow 4s ease-in-out infinite' }}>🏛️</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
              Ready to file a <span className="gradient-text">complaint?</span>
            </h2>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
              Join thousands of citizens using AI-powered complaint management for faster resolution
            </p>
            <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/register-complaint') : '/signup'}
              className="btn btn-primary" style={{ padding: '14px 36px', fontSize: 15, borderRadius: 14 }}>
              {user ? (user.role === 'admin' ? '⚙️ Go to Dashboard' : '➕ File Complaint Now') : '🚀 Get Started Free'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
