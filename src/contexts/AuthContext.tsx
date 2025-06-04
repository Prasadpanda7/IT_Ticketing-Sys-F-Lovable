
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    username: 'john.doe',
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'client',
    department: 'Marketing',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    department: 'IT',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'jane.smith',
    email: 'jane.smith@company.com',
    password: 'password123',
    role: 'client',
    department: 'Finance',
    createdAt: new Date().toISOString(),
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
