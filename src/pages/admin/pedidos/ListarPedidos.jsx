import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Calendar, DollarSign, Package } from "lucide-react"
import "../../../styles/ListarPedidos.css";


function ListarPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get("http://localhost:8080/api/pedidos/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setPedidos(response.data)
      } catch (error) {
        console.error("Error al obtener pedidos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getStatusBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "status-pending"
      case "procesando":
        return "status-processing"
      case "enviado":
        return "status-shipped"
      case "entregado":
        return "status-delivered"
      case "cancelado":
        return "status-cancelled"
      default:
        return "status-default"
    }
  }

  if (loading) {
    return (
      <div className="listar-pedidos-loading-container">
        <div className="listar-pedidos-loading-spinner"></div>
        <p className="listar-pedidos-loading-text">Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="listar-pedidos-container">
      <div className="listar-pedidos-header-section">
        <div className="listar-pedidos-title-wrapper">
          <ShoppingBag className="listar-pedidos-title-icon" />
          <h2 className="listar-pedidos-page-title">Pedidos</h2>
        </div>
        <div className="listar-pedidos-stats-badge">
          {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
        </div>
      </div>

      <div className="listar-pedidos-table-container">
        <div className="listar-pedidos-table-wrapper">
          <table className="listar-pedidos-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.idPedido} className="listar-pedidos-table-row">
                  <td className="listar-pedidos-id-cell">{pedido.idPedido}</td>
                  <td className="listar-pedidos-total-cell">
                    <div className="listar-pedidos-total-wrapper">
                      <DollarSign className="listar-pedidos-currency-icon" />
                      <span className="listar-pedidos-total-amount">{formatCurrency(pedido.total)}</span>
                    </div>
                  </td>
                  <td className="listar-pedidos-status-cell">
                    <span className={`listar-pedidos-status-badge ${getStatusBadgeClass(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="listar-pedidos-date-cell">
                    <div className="listar-pedidos-date-wrapper">
                      <Calendar className="listar-pedidos-date-icon" />
                      <span className="listar-pedidos-date-text">{formatDate(pedido.fechaPedido)}</span>
                    </div>
                  </td>
                  <td className="listar-pedidos-actions-cell">
                    <Link
                      to={`/admin/pedidos/detalle/${pedido.idPedido}`}
                      className="listar-pedidos-action-btn listar-pedidos-view-btn"
                      title="Ver detalle del pedido"
                    >
                      <Eye className="listar-pedidos-btn-icon" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pedidos.length === 0 && (
        <div className="listar-pedidos-empty-state">
          <Package className="listar-pedidos-empty-icon" />
          <h3 className="listar-pedidos-empty-title">No hay pedidos</h3>
          <p className="listar-pedidos-empty-description">Aún no se han registrado pedidos en el sistema.</p>
        </div>
      )}
    </div>
  )
}

export default ListarPedidos
