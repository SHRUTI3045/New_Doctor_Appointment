import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    return {
      token,
      role: localStorage.getItem('role'),
      userName: localStorage.getItem('userName'),
      userId: Number(localStorage.getItem('userId')),
    }
  })

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('userName', data.userName)
    localStorage.setItem('userId', data.userId)
    setUser(data)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
