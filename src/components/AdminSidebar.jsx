import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminSidebar({ sidebarCollapsed, setSidebarCollapsed, onLogout }) {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      subItems: [
        { id: "dashboard", label: "Panel Principal", icon: "🏠", path: "/admin/dashboard" },
      ],
    },
    {
      id: "productos",
      label: "Productos",
      icon: "📦",
      subItems: [
        { id: "listar", label: "Listar", icon: "📋", path: "/admin/productos/listar" },
        { id: "agregar", label: "Agregar", icon: "➕", path: "/admin/productos/agregar" },
        { id: "galeria", label: "Galería", icon: "🖼️", path: "/admin/productos/galeria" },
      ],
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: "🏷️",
      subItems: [
        { id: "listar", label: "Listar", icon: "📋", path: "/admin/categorias/listar" },
        { id: "crear", label: "Crear", icon: "➕", path: "/admin/categorias/crear" },
      ],
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icon: "🛒",
      subItems: [
        { id: "listar", label: "Listar", icon: "📋", path: "/admin/pedidos/listar" },
      ],
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: "👥",
      subItems: [
        { id: "listar", label: "Listar", icon: "📋", path: "/admin/usuarios/listar" },
        { id: "crear", label: "Crear Usuario", icon: "👤", path: "/admin/usuarios/crear" },
      ],
    },
    {
      id: "config",
      label: "Configuración",
      icon: "⚙️",
      subItems: [
        { id: "envios", label: "Envíos", icon: "🚚", path: "/admin/config/envios" },
        { id: "pagos", label: "Pagos", icon: "💳", path: "/admin/config/pagos" },
      ],
    },
  ];

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">👑</span>
          {!sidebarCollapsed && <span className="logo-text">Admin Panel</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-group">
            <button
              className="nav-item"
              onClick={() => toggleMenu(item.id)}
              aria-expanded={expandedMenus[item.id]}
              aria-controls={`submenu-${item.id}`}
            >
              <span className="nav-icon" role="img" aria-label={item.label}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  <span className={`nav-arrow ${expandedMenus[item.id] ? "expanded" : ""}`}>▼</span>
                </>
              )}
            </button>

            {!sidebarCollapsed && expandedMenus[item.id] && (
              <div className="sub-menu" id={`submenu-${item.id}`}>
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className="sub-nav-item"
                    onClick={() => navigate(subItem.path)}
                  >
                    <span className="sub-nav-icon" role="img" aria-label={subItem.label}>
                      {subItem.icon}
                    </span>
                    <span className="sub-nav-label">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout} aria-label="Cerrar sesión">
          <span className="nav-icon" role="img" aria-label="Logout">
            🚪
          </span>
          {!sidebarCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
