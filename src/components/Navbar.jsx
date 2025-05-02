import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">NovaShop</Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>

          {user ? (
            <>
              {/* Enlace DIRECTAMENTE a /user sin validar rol */}
              <Link to="/user" className="nav-link">Mi Panel</Link>
              <button onClick={logout} className="nav-button">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;