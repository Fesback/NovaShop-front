
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import "../styles/UserPanel.css"

function UserPanel() {
  const [nombre, setNombre] = useState("")
  const [activeSection, setActiveSection] = useState("inicio")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)

        // Log para verificar la decodificación
        console.log("Token decodificado:", decoded)

        // Si el backend no manda "nombre", usamos el correo (sub)
        const correo = decoded.sub || "usuario@correo.com"
        const nombreExtraido = correo.split("@")[0] // saca la parte antes del @
        const nombreFormateado = nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1)

        setNombre(decoded.nombre || nombreFormateado)
      } catch (error) {
        console.error("Token inválido", error)
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token") // Elimina el token del localStorage
    navigate("/login") // Redirige al login
  }

  const menuItems = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "pedidos", label: "Mis Pedidos", icon: "📦" },
    { id: "configuracion", label: "Configuración", icon: "⚙️" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Bienvenido, {nombre} 👋</h1>
              <p>Este es tu panel de usuario. Desde aquí podrás acceder a todas tus funcionalidades.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>15</h3>
                  <p>Pedidos Totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>12</h3>
                  <p>Completados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>3</h3>
                  <p>En Proceso</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>$2,450</h3>
                  <p>Total Gastado</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Actividad Reciente</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📦</div>
                  <div className="activity-content">
                    <p>
                      <strong>Pedido #1234</strong> ha sido enviado
                    </p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p>
                      <strong>Pedido #1233</strong> completado
                    </p>
                    <span className="activity-time">Ayer</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>Perfil actualizado</p>
                    <span className="activity-time">Hace 3 días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "perfil":
        return (
          <div className="content-section">
            <h1>Mi Perfil</h1>
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">{nombre.charAt(0)}</div>
              </div>
              <div className="profile-info">
                <h2>{nombre}</h2>
                <p>Usuario Premium</p>
                <button className="btn-secondary">Editar Perfil</button>
              </div>
            </div>
          </div>
        )
      case "pedidos":
        return (
          <div className="content-section">
            <h1>Mis Pedidos</h1>
            <div className="orders-table">
              <div className="table-header">
                <span>ID</span>
                <span>Fecha</span>
                <span>Estado</span>
                <span>Total</span>
              </div>
              <div className="table-row">
                <span>#1234</span>
                <span>15/01/2024</span>
                <span className="status-badge status-shipped">Enviado</span>
                <span>$150.00</span>
              </div>
              <div className="table-row">
                <span>#1233</span>
                <span>12/01/2024</span>
                <span className="status-badge status-completed">Completado</span>
                <span>$89.99</span>
              </div>
              <div className="table-row">
                <span>#1232</span>
                <span>10/01/2024</span>
                <span className="status-badge status-processing">En Proceso</span>
                <span>$245.50</span>
              </div>
            </div>
          </div>
        )
      case "configuracion":
        return (
          <div className="content-section">
            <h1>Configuración</h1>
            <div className="settings-grid">
              <div className="setting-item">
                <h3>Notificaciones</h3>
                <p>Gestiona tus preferencias de notificación</p>
                <button className="btn-secondary">Configurar</button>
              </div>
              <div className="setting-item">
                <h3>Privacidad</h3>
                <p>Controla tu privacidad y datos</p>
                <button className="btn-secondary">Configurar</button>
              </div>
              <div className="setting-item">
                <h3>Seguridad</h3>
                <p>Cambia tu contraseña y configuración de seguridad</p>
                <button className="btn-secondary">Configurar</button>
              </div>
            </div>
          </div>
        )
      default:
        return <div>Sección no encontrada</div>
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            {!sidebarCollapsed && <span className="logo-text">Dashboard</span>}
          </div>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h2>Panel de Usuario</h2>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{nombre.charAt(0)}</div>
              <span className="user-name">{nombre}</span>
            </div>
          </div>
        </header>

        <div className="content-wrapper">{renderContent()}</div>
      </main>
    </div>
  )
}

export default UserPanel

