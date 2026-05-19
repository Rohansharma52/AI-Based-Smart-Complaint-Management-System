import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const SESSION_ID = 'chat_' + Math.random().toString(36).slice(2)

const QUICK = [
  '🔍 How to track my complaint?',
  '📝 How to register a complaint?',
  '⚡ Electricity issue — which department?',
  '💧 Water leakage — what priority?',
  '📊 What does AI analysis mean?',
]

export default function Chatbot() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user?.username || 'there'}! 👋 I'm your SmartComplaint AI Assistant. How can I help you today?`, time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150) }
  }, [open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg, time: new Date() }])
    setLoading(true)
    try {
      const token = localStorage.getItem('complaint_token')
      const res = await axios.post('/api/chat/message', { message: msg, sessionId: SESSION_ID },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date() }])
      if (!open) setUnread(n => n + 1)
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ ' + (err.response?.data?.message || 'Something went wrong'), time: new Date(), error: true }])
    } finally { setLoading(false) }
  }

  const fmt = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const renderText = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;font-size:11px">$1</code>')
    .replace(/\n/g, '<br/>')

  if (!user) return null

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all duration-300 ${
          open ? 'bg-gradient-to-br from-red-600 to-red-500 rotate-0 scale-95' : 'bg-gradient-to-br from-indigo-600 to-cyan-500 hover:scale-110 hover:shadow-[0_12px_40px_rgba(99,102,241,0.7)]'
        }`}>
        {open ? '✕' : '🤖'}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-[#0a0a14]">
            {unread}
          </span>
        )}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl bg-indigo-500/30 animate-ping"></span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-indigo-500/20 anim-fade-up"
          style={{ background: '#0d0d1a' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 border-b border-white/6 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm leading-none">SmartComplaint AI</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500">Online • GPT-3.5</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={async () => {
                try { await axios.post('/api/chat/clear', { sessionId: SESSION_ID }, { headers: { Authorization: `Bearer ${localStorage.getItem('complaint_token')}` } }) } catch {}
                setMessages([{ role:'bot', text:'Chat cleared! How can I help you? 😊', time: new Date() }])
              }} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-slate-500 hover:text-slate-300 text-xs flex items-center justify-center transition-all" title="Clear">
                🗑️
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/8 text-slate-500 hover:text-red-400 text-xs flex items-center justify-center transition-all">
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '340px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 anim-fade-in ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🤖</div>
                )}
                <div className={`max-w-[78%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-sm shadow-[0_2px_10px_rgba(99,102,241,0.3)]'
                      : m.error
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
                        : 'bg-white/5 border border-white/6 text-slate-200 rounded-bl-sm'
                  }`}
                    dangerouslySetInnerHTML={{ __html: renderText(m.text) }}
                  />
                  <span className="text-[10px] text-slate-700 px-1">{fmt(m.time)}</span>
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="flex gap-2 anim-fade-in">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="px-4 py-3 bg-white/5 border border-white/6 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                        style={{ animation: `typing 1.2s ease-in-out ${i*0.2}s infinite` }}></span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex-shrink-0">
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide mb-1.5">Quick questions:</p>
              <div className="flex flex-col gap-1">
                {QUICK.map((q, i) => (
                  <button key={i} onClick={() => send(q)} disabled={loading}
                    className="text-left px-3 py-1.5 bg-white/3 hover:bg-indigo-500/10 border border-white/6 hover:border-indigo-500/20 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all truncate">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/6 flex-shrink-0 bg-[#0d0d1a]">
            <div className="flex gap-2">
              <textarea ref={inputRef} rows={1}
                className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl px-3 py-2.5 text-white text-xs placeholder-slate-600 outline-none resize-none transition-all"
                placeholder="Ask anything... (Enter to send)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                disabled={loading}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0 self-end ${
                  input.trim() && !loading
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-[0_2px_10px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_15px_rgba(99,102,241,0.6)]'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}>
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" style={{ animation:'spin 0.7s linear infinite', display:'block' }}></span>
                ) : '➤'}
              </button>
            </div>
            <p className="text-[10px] text-slate-700 text-center mt-1.5">Enter = Send • Shift+Enter = New line</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}

