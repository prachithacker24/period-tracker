import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        fetchUser(parsedUser.id)
      } catch (err) {
        localStorage.removeItem('user')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (userId) => {
    try {
      const response = await authAPI.getProfile(userId)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      setError(null)
    } catch (err) {
      localStorage.removeItem('user')
      setError('Session expired. Please login again.')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, name) => {
    try {
      setError(null)
      const response = await authAPI.signup(email, password, name)
      return { success: true, data: response.data }
    } catch (err) {
      const message = err.response?.data?.detail || 'Signup failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authAPI.login(email, password)
      const userData = response.data
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('user')
      setUser(null)
      setError(null)
    }
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
