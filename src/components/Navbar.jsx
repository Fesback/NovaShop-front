import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); // ✅ obtener cantidad del carrito

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">NovaShop</Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>

          <Link to="/cart" className="nav-link">
            🛒 Carrito ({cartCount})
          </Link> {/* ✅ botón del carrito */}

          {user ? (
            <>
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
