import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Calendar, DollarSign, Package,  RefreshCw } from 'lucide-react';
import "../../../styles/DetallePedidos.css";

function DetallePedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [estado, setEstado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8080/api/pedidos/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pedidoEncontrado = response.data.find((p) => p.idPedido === parseInt(id));
        setPedido(pedidoEncontrado);
        setEstado(pedidoEncontrado?.estado || "");
      } catch (error) {
        console.error("Error al cargar el pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const actualizarEstado = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:8080/api/pedidos/${id}/estado?estado=${estado}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje("Estado actualizado con éxito");
      // Actualizar el estado del pedido en la UI
      setPedido({ ...pedido, estado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setMensaje("Error al actualizar estado");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "status-pending";
      case "en_proceso":
      case "procesando":
        return "status-processing";
      case "en_camino":
        return "status-shipped";
      case "entregado":
        return "status-delivered";
      case "cancelado":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <div className="detalle-pedidos-loading-container">
        <div className="detalle-pedidos-loading-spinner"></div>
        <p className="detalle-pedidos-loading-text">Cargando detalle del pedido...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="detalle-pedidos-empty-state">
        <Package className="detalle-pedidos-empty-icon" />
        <h3 className="detalle-pedidos-empty-title">Pedido no encontrado</h3>
        <p className="detalle-pedidos-empty-description">El pedido con ID #{id} no existe o no se pudo cargar.</p>
      </div>
    );
  }

  return (
    <div className="detalle-pedidos-container">
      <div className="detalle-pedidos-header-section">
        <div className="detalle-pedidos-title-wrapper">
          <ShoppingBag className="detalle-pedidos-title-icon" />
          <h2 className="detalle-pedidos-page-title">Detalle del Pedido #{pedido.idPedido}</h2>
        </div>
      </div>

      <div className="detalle-pedidos-card">
        <div className="detalle-pedidos-card-row">
          <div className="detalle-pedidos-card-item">
            <div className="detalle-pedidos-card-icon">
              <DollarSign />
            </div>
            <div>
              <h3 className="detalle-pedidos-card-label">Total</h3>
              <p className="detalle-pedidos-card-value">{formatCurrency(pedido.total)}</p>
            </div>
          </div>

          <div className="detalle-pedidos-card-item">
            <div className="detalle-pedidos-card-icon">
              <div className={`detalle-pedidos-status-badge ${getStatusBadgeClass(pedido.estado)}`}>
                {pedido.estado}
              </div>
            </div>
            <div>
              <h3 className="detalle-pedidos-card-label">Estado</h3>
              <p className="detalle-pedidos-card-value">{pedido.estado}</p>
            </div>
          </div>

          <div className="detalle-pedidos-card-item">
            <div className="detalle-pedidos-card-icon">
              <Calendar />
            </div>
            <div>
              <h3 className="detalle-pedidos-card-label">Fecha</h3>
              <p className="detalle-pedidos-card-value">{formatDate(pedido.fechaPedido)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detalle-pedidos-section">
        <h3 className="detalle-pedidos-section-title">
          <Package className="detalle-pedidos-section-icon" />
          Productos
        </h3>
        <div className="detalle-pedidos-table-container">
          <table className="detalle-pedidos-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, index) => (
                <tr key={index} className="detalle-pedidos-table-row">
                  <td className="detalle-pedidos-product-cell">
                    <div className="detalle-pedidos-product-info">
                      <span className="detalle-pedidos-product-name">{item.nombreProducto}</span>
                      <span className="detalle-pedidos-product-sku">SKU: {item.idProducto}</span>
                    </div>
                  </td>
                  <td className="detalle-pedidos-quantity-cell">{item.cantidad}</td>
                  <td className="detalle-pedidos-price-cell">{formatCurrency(item.precio)}</td>
                  <td className="detalle-pedidos-subtotal-cell">{formatCurrency(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="detalle-pedidos-section">
        <h3 className="detalle-pedidos-section-title">
          <RefreshCw className="detalle-pedidos-section-icon" />
          Actualizar Estado del Pedido
        </h3>
        <div className="detalle-pedidos-status-update">
          <div className="detalle-pedidos-form-group">
            <label>Selecciona un nuevo estado:</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="detalle-pedidos-status-select"
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="PROCESANDO">PROCESANDO</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="ENTREGADO">ENTREGADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>
          <button
            onClick={actualizarEstado}
            className="detalle-pedidos-update-button"
          >
            Actualizar Estado
          </button>
          {mensaje && <p className={`detalle-pedidos-message ${mensaje.includes('éxito') ? 'success' : 'error'}`}>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;