import React, { useState } from 'react'
import { complaintAPI, aiAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LoadingSpinner } from './LoadingSpinner'

const STATUS_COLORS = {
  'Pending': 'badge-pending',
  'In Progress': 'badge-progress',
  'Resolved': 'badge-resolved'
}

const PRIORITY_COLORS = {
  'High': 'badge-high',
  'Medium': 'badge-medium',
  'Low': 'badge-low'
}

const CATEGORY_ICONS = {
  'Water Supply': '💧', 'Electricity': '⚡', 'Roads': '🛣️',
  'Sanitation': '🗑️', 'Public Safety': '🛡️', 'Healthcare': '🏥',
  'Education': '📚', 'Other': '📌'
}

export default function ComplaintCard({ complaint, onUpdate, onDelete }) {
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [aiResult, setAiResult] = useState(complaint.aiAnalysis?.priority ? complaint.aiAnalysis : null)

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await aiAPI.analyze({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
        complaintId: complaint._id
      })
      setAiResult(res.data)
      toast.success('AI analysis complete!')
      if (onUpdate) onUpdate({ ...complaint, aiAnalysis: res.data })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await complaintAPI.update(complaint._id, { status: newStatus })
      toast.success('Status updated!')
      if (onUpdate) onUpdate(res.data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint?')) return
    try {
      await complaintAPI.delete(complaint._id)
      toast.success('Complaint deleted')
      if (onDelete) onDelete(complaint._id)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="card hover:border-primary-500/40 hover:shadow-card-hover transition-all duration-300 anim-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xl flex-shrink-0">
            {CATEGORY_ICONS[complaint.category] || '📌'}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight truncate">{complaint.title}</h3>
            <p className="text-slate-500 text-xs mt-0.5">📍 {complaint.location} • {formatDate(complaint.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={STATUS_COLORS[complaint.status]}>{complaint.status}</span>
          {aiResult?.priority && <span className={PRIORITY_COLORS[aiResult.priority]}>{aiResult.priority}</span>}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-0.5 bg-accent-500/10 border border-accent-500/20 rounded-lg text-xs text-accent-400">{complaint.category}</span>
        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">👤 {complaint.name}</span>
        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">✉️ {complaint.email}</span>
      </div>

      {/* Description preview */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{complaint.description}</p>

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary-400 text-xs font-semibold hover:text-primary-300 transition-colors mb-3"
      >
        {expanded ? '▲ Show less' : '▼ Show more'}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="space-y-3 anim-fade-in">
          <p className="text-slate-300 text-sm leading-relaxed bg-white/3 rounded-xl p-3 border border-white/5">
            {complaint.description}
          </p>

          {/* AI Analysis */}
          {aiResult && (
            <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/5 border border-primary-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <h4 className="font-bold text-primary-300 text-sm">AI Analysis</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Priority</p>
                  <span className={PRIORITY_COLORS[aiResult.priority]}>{aiResult.priority}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-xs text-white font-medium">{aiResult.department}</p>
                </div>
              </div>
              {aiResult.summary && (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">📝 Summary</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiResult.summary}</p>
                </div>
              )}
              {aiResult.autoResponse && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-400 mb-1">💬 Auto Response</p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{aiResult.autoResponse}"</p>
                </div>
              )}
            </div>
          )}

          {/* Admin controls */}
          {user?.role === 'admin' && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              <p className="text-xs text-slate-500 w-full mb-1">Update Status:</p>
              {['Pending', 'In Progress', 'Resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || complaint.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    complaint.status === s
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {updating ? '...' : s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 hover:border-primary-500/40 rounded-lg text-xs font-semibold text-primary-300 transition-all"
        >
          {analyzing ? <LoadingSpinner size="sm" /> : '🤖'}
          {analyzing ? 'Analyzing...' : aiResult ? 'Re-analyze' : 'AI Analyze'}
        </button>

        {user?.role === 'admin' && (
          <button onClick={handleDelete} className="ml-auto px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400 transition-all">
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

