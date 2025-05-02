import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Función para normalizar el rol
  const normalizeRole = (role) => {
    if (!role) return 'user';
    return role.replace('ROLE_', '').toLowerCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          role: normalizeRole(decoded.authorities?.[0]) // Normaliza el rol aquí
        });
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({
      email: decoded.sub,
      role: normalizeRole(decoded.authorities?.[0]) // Normaliza el rol aquí
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);