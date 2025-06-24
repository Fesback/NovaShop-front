import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Package,
  Users,
  ShoppingCart,
  Folder,
  DollarSign,
  Activity,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"
import "../../styles/DashboardHome.css";

function DashboardHome() {
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
    ultimosPedidos: [],
  })
  const [loading, setLoading] = useState(true)
  const [fechaActual, setFechaActual] = useState(new Date())
  const [systemMetrics, setSystemMetrics] = useState({
    productosActivos: 85,
    usuariosActivos: 92,
    pedidosCompletados: 78,
    ventasRendimiento: 94,
  })

  const canvasRef = useRef(null)

  useEffect(() => {
    fetchResumen()

    // Update time
    const timeInterval = setInterval(() => {
      setFechaActual(new Date())
    }, 1000)

    // Simulate changing metrics
    const metricsInterval = setInterval(() => {
      setSystemMetrics({
        productosActivos: Math.floor(Math.random() * 15) + 80,
        usuariosActivos: Math.floor(Math.random() * 10) + 88,
        pedidosCompletados: Math.floor(Math.random() * 20) + 70,
        ventasRendimiento: Math.floor(Math.random() * 12) + 90,
      })
    }, 5000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = []
    const particleCount = 60

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.2
        this.speedY = (Math.random() - 0.5) * 0.2
        this.color = `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 50)}, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const fetchResumen = async () => {
    try {
      const token = localStorage.getItem("token")
      const [productosRes, categoriasRes, usuariosRes, pedidosRes] = await Promise.all([
        axios.get("http://localhost:8080/api/productos", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/categorias", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/usuarios", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/pedidos/admin", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const ultimosPedidos = pedidosRes.data.slice(0, 5)

      setResumen({
        totalProductos: productosRes.data.length,
        totalCategorias: categoriasRes.data.length,
        totalUsuarios: usuariosRes.data.length,
        totalPedidos: pedidosRes.data.length,
        ultimosPedidos,
      })
    } catch (error) {
      console.error("Error al obtener resumen del dashboard", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case "completado":
        return <CheckCircle size={14} className="status-icon success" />
      case "pendiente":
        return <Clock size={14} className="status-icon warning" />
      case "cancelado":
        return <XCircle size={14} className="status-icon danger" />
      default:
        return <AlertCircle size={14} className="status-icon info" />
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

/*   const calcularTotalVentas = () => {
    return resumen.ultimosPedidos.reduce((total, pedido) => total + pedido.total, 0)
  } */

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
              <div className="ring ring-4"></div>
            </div>
            <div className="loading-text">SISTEMA INICIALIZANDO</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Background Effects */}
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="grid-overlay"></div>

      {/* Main Content */}
      <div className="main-content">
        {/* System Overview */}
        <div className="overview-section">
          <div className="section-header">
            <div className="section-title">
              <Activity className="title-icon" />
              <h2>Panel de Administración</h2>
            </div>
            <div className="section-controls">
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>EN VIVO</span>
              </div>
              <button className="control-btn">
                <RefreshCw className="btn-icon" />
              </button>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-header">
                <div className="metric-icon">
                  <Package size={20} />
                </div>
                <div className="metric-trend up">
                  <BarChart3 size={14} />
                </div>
              </div>
              <div className="metric-content">
                <div className="metric-value">{systemMetrics.productosActivos}%</div>
                <div className="metric-label">Productos</div>
                <div className="metric-detail">{resumen.totalProductos} total | Activos</div>
              </div>
              <div className="metric-chart">
                <div className="chart-bars">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="chart-bar primary" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-header">
                <div className="metric-icon">
                  <Users size={20} />
                </div>
                <div className="metric-trend up">
                  <BarChart3 size={14} />
                </div>
              </div>
              <div className="metric-content">
                <div className="metric-value">{systemMetrics.usuariosActivos}%</div>
                <div className="metric-label">Usuarios</div>
                <div className="metric-detail">{resumen.totalUsuarios} total | Conectados</div>
              </div>
              <div className="metric-chart">
                <div className="chart-bars">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="chart-bar success" style={{ height: `${Math.random() * 60 + 30}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-header">
                <div className="metric-icon">
                  <ShoppingCart size={20} />
                </div>
                <div className="metric-trend down">
                  <BarChart3 size={14} className="rotate-180" />
                </div>
              </div>
              <div className="metric-content">
                <div className="metric-value">{systemMetrics.pedidosCompletados}%</div>
                <div className="metric-label">Pedidos</div>
                <div className="metric-detail">{resumen.totalPedidos} total | Completados</div>
              </div>
              <div className="metric-chart">
                <div className="chart-bars">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="chart-bar warning" style={{ height: `${Math.random() * 50 + 25}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Orders Section */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <ShoppingCart className="title-icon" />
                <h3>Últimos Pedidos</h3>
              </div>
              <button className="card-action">
                Ver todos
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="card-content">
              {resumen.ultimosPedidos.length === 0 ? (
                <div className="empty-state">
                  <ShoppingCart size={32} />
                  <p>No hay pedidos recientes</p>
                </div>
              ) : (
                <div className="orders-list">
                  {resumen.ultimosPedidos.map((pedido, index) => (
                    <div key={pedido.idPedido} className="order-item" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="order-id">
                        <span className="id-badge">#{pedido.idPedido}</span>
                      </div>
                      <div className="order-details">
                        <div className="order-amount">
                          <DollarSign size={14} />
                          <span>${pedido.total.toLocaleString()}</span>
                        </div>
                        <div className="order-date">{formatearFecha(pedido.fechaPedido)}</div>
                      </div>
                      <div className="order-status">
                        {getEstadoIcon(pedido.estado)}
                        <span className={`status-text ${pedido.estado?.toLowerCase()}`}>{pedido.estado}</span>
                      </div>
                      <button className="order-action">
                        <Eye size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Section */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <Activity className="title-icon" />
                <h3>Actividad del Sistema</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">
                    <CheckCircle size={14} />
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>Nuevo usuario registrado</strong>
                    </p>
                    <span className="activity-time">Hace 2 minutos</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon primary">
                    <Package size={14} />
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>Producto actualizado</strong>
                    </p>
                    <span className="activity-time">Hace 15 minutos</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon warning">
                    <ShoppingCart size={14} />
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>Nuevo pedido recibido</strong>
                    </p>
                    <span className="activity-time">Hace 1 hora</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">
                    <Users size={14} />
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>Usuario actualizado</strong>
                    </p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar-right">
          {/* System Time */}
          <div className="sidebar-card">
            <div className="time-display">
              <div className="time-label">HORA DEL SISTEMA</div>
              <div className="time-value">{formatTime(fechaActual)}</div>
              <div className="date-value">{formatDate(fechaActual)}</div>
            </div>
            <div className="time-details">
              <div className="time-detail">
                <div className="detail-label">Tiempo Activo</div>
                <div className="detail-value">14d 06:42:18</div>
              </div>
              <div className="time-detail">
                <div className="detail-label">Zona Horaria</div>
                <div className="detail-value">UTC-05:00</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <div className="card-title">
              <h3>Acciones Rápidas</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action">
                <Package size={16} />
                <span>Nuevo Producto</span>
              </button>
              <button className="quick-action">
                <Users size={16} />
                <span>Nuevo Usuario</span>
              </button>
              <button className="quick-action">
                <Folder size={16} />
                <span>Nueva Categoría</span>
              </button>
              <button className="quick-action">
                <BarChart3 size={16} />
                <span>Ver Reportes</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="sidebar-card">
            <div className="card-title">
              <h3>Estado del Sistema</h3>
            </div>
            <div className="system-status">
              <div className="status-item">
                <div className="status-label">Productos Activos</div>
                <div className="status-value">{systemMetrics.productosActivos}%</div>
                <div className="status-bar">
                  <div className="status-fill primary" style={{ width: `${systemMetrics.productosActivos}%` }}></div>
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Usuarios Conectados</div>
                <div className="status-value">{systemMetrics.usuariosActivos}%</div>
                <div className="status-bar">
                  <div className="status-fill success" style={{ width: `${systemMetrics.usuariosActivos}%` }}></div>
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Rendimiento Ventas</div>
                <div className="status-value">{systemMetrics.ventasRendimiento}%</div>
                <div className="status-bar">
                  <div className="status-fill warning" style={{ width: `${systemMetrics.ventasRendimiento}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome