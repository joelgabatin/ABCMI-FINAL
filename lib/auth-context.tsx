"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserRole = 'member' | 'admin' | 'pastor'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
  isPastor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for demonstration purposes
const DEMO_USERS: (User & { password: string })[] = [
  { id: '1', name: 'Admin User', email: 'admin@church.org', password: 'admin123', role: 'admin' },
  { id: '2', name: 'John Member', email: 'john@example.com', password: 'member123', role: 'member' },
  { id: '3', name: 'Ptr. Julio Coyoy', email: 'pastor@abcmi.org', password: 'pastor123', role: 'pastor' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('church_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('church_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('church_user', JSON.stringify(userWithoutPassword))
      return { success: true, role: foundUser.role }
    }
    
    return { success: false, error: 'Invalid email or password' }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if email already exists
    if (DEMO_USERS.some(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    
    // Create new user (in demo mode, just create a member)
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      role: 'member'
    }
    
    setUser(newUser)
    localStorage.setItem('church_user', JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('church_user')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin: user?.role === 'admin',
    isPastor: user?.role === 'pastor'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
