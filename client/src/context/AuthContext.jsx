import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('complaint_token')
    const savedUser = localStorage.getItem('complaint_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      authAPI.getMe()
        .then(res => setUser(res.user))
        .catch(() => { localStorage.removeItem('complaint_token'); localStorage.removeItem('complaint_user'); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (data) => {
    try {
      const res = await authAPI.signup(data)
      localStorage.setItem('complaint_token', res.token)
      localStorage.setItem('complaint_user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success(res.message || 'Account created!')
      return { success: true }
    } catch (err) {
      toast.error(err.message)
      return { success: false }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password })
      localStorage.setItem('complaint_token', res.token)
      localStorage.setItem('complaint_user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success(res.message || 'Login successful!')
      return { success: true }
    } catch (err) {
      toast.error(err.message)
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('complaint_token')
    localStorage.removeItem('complaint_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
