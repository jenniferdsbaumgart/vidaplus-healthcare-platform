import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  avatar?: string;
};

// Define the Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
});

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    email: 'dr.ana@vidaplus.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'doctor',
    avatar: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'Admin João',
    email: 'admin@vidaplus.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage in this mock example)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function (would be API call in a real app)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const matchedUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (matchedUser) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = matchedUser;
        
        // Store in state and localStorage
        setUser(userWithoutPassword as User);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);