import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react"
import "../styles/Navbar.css" 

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          NovaShop
        </Link>

        <div className="search-container">
          <input type="text" placeholder="Buscar" className="search-input" />
          <Search className="search-icon" size={18} />
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/productos" className="nav-link">
            Productos
          </Link>
          <Link to="/contacto" className="nav-link">
            Contacto
          </Link>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
        </div>

        <div className="nav-icons">
          <Link to="/favoritos" className="icon-link">
            <Heart size={20} />
          </Link>

          <Link to="/cart" className="icon-link cart-link">
            <div className="cart-icon">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </Link>

          <div className="user-dropdown" ref={dropdownRef}>
            <button className="icon-button" onClick={toggleDropdown}>
              <User size={20} />
              <ChevronDown size={14} className={`chevron ${dropdownOpen ? "open" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <p>Hola, {user.name || "Usuario"}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    {user.role === "admin" ? (
                      <Link to="/admin" className="dropdown-item">
                        Panel de Administrador
                      </Link>
                    ) : (
                      <Link to="/user" className="dropdown-item">
                        Mi Panel
                      </Link>
                    )}
                    <Link to="/pedidos" className="dropdown-item">
                      Mis Pedidos
                    </Link>
                    <Link to="/perfil" className="dropdown-item">
                      Mi Perfil
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="dropdown-item logout">
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item">
                      Iniciar Sesión
                    </Link>
                    <Link to="/register" className="dropdown-item">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
