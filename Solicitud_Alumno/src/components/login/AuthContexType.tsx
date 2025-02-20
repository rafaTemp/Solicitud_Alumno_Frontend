import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface AuthContextType {
  isAuthenticated: boolean;
  role: 'teacher' | 'student' | null;
  login: (token: string, role: 'teacher' | 'student') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [loading, setLoading] = useState(true); // Para evitar parpadeos en la UI

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role') as 'teacher' | 'student' | null;

    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }

    setLoading(false); // Marca que la carga ha terminado
  }, []);

  const login = (token: string, role: 'teacher' | 'student') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  if (loading) {
    return <div>Cargando...</div>; // Evita que la UI se monte con datos erróneos
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
