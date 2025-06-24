import { useState, useEffect } from "react";
import { CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Edit,
  Save,
  X,
  Plus,
  Settings,
  DollarSign,
  Percent,
  Clock,
  Shield,
  AlertCircle,
  TrendingUp,
  Wallet,
  Building,
  Globe,
  Target,
  Calculator, } from "lucide-react"
  import "../../../styles/ConfigPagos.css"

function ConfigPagos() {
  const [metodosPago, setMetodosPago] = useState([
    {
      id: 1,
      nombre: "Yape",
      descripcion: "Pago por QR desde móvil",
      icon: <Smartphone size={20} />,
      activo: true,
      comision: 0,
      limiteMin: 1,
      limiteMax: 500,
      descuento: 0,
      editando: false,
      categoria: "digital",
    },
    {
      id: 2,
      nombre: "Transferencia Bancaria",
      descripcion: "Deposita directo a la cuenta de la tienda",
      icon: <Building size={20} />,
      activo: false,
      comision: 0,
      limiteMin: 10,
      limiteMax: 10000,
      descuento: 2,
      editando: false,
      categoria: "bancario",
    },
    {
      id: 3,
      nombre: "Pago contra entrega",
      descripcion: "El cliente paga cuando recibe el producto",
      icon: <Banknote size={20} />,
      activo: true,
      comision: 0,
      limiteMin: 1,
      limiteMax: 200,
      descuento: 0,
      editando: false,
      categoria: "efectivo",
    },
    {
      id: 4,
      nombre: "Tarjeta de Crédito/Débito",
      descripcion: "Visa, Mastercard, American Express",
      icon: <CreditCard size={20} />,
      activo: true,
      comision: 3.5,
      limiteMin: 5,
      limiteMax: 5000,
      descuento: 0,
      editando: false,
      categoria: "tarjeta",
    },
    {
      id: 5,
      nombre: "Plin",
      descripcion: "Billetera digital del BCP",
      icon: <Wallet size={20} />,
      activo: true,
      comision: 0,
      limiteMin: 1,
      limiteMax: 500,
      descuento: 1,
      editando: false,
      categoria: "digital",
    },
    {
      id: 6,
      nombre: "PagoEfectivo",
      descripcion: "Pago en agentes y tiendas",
      icon: <Globe size={20} />,
      activo: false,
      comision: 2.5,
      limiteMin: 5,
      limiteMax: 1000,
      descuento: 0,
      editando: false,
      categoria: "agente",
    },
  ])

  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  const [configuracion, setConfiguracion] = useState({
    monedaPrincipal: "PEN",
    iva: 18,
    comisionGeneral: 2.5,
    descuentoMaximo: 10,
    limiteTransaccion: 10000,
    tiempoExpiracion: 24,
  })

  const [estadisticas, setEstadisticas] = useState({
    metodosActivos: 0,
    comisionPromedio: 0,
    descuentoPromedio: 0,
    limitePromedio: 0,
  })

  const [nuevoMetodo, setNuevoMetodo] = useState({
    nombre: "",
    descripcion: "",
    categoria: "digital",
    comision: 0,
    limiteMin: 1,
    limiteMax: 1000,
    descuento: 0,
  })

  useEffect(() => {
  const metodosActivos = metodosPago.filter((m) => m.activo)
  const comisionPromedio =
    metodosActivos.reduce((sum, m) => sum + Number.parseFloat(m.comision), 0) / metodosActivos.length || 0
  const descuentoPromedio =
    metodosActivos.reduce((sum, m) => sum + Number.parseFloat(m.descuento), 0) / metodosActivos.length || 0
  const limitePromedio =
    metodosActivos.reduce((sum, m) => sum + Number.parseFloat(m.limiteMax), 0) / metodosActivos.length || 0

  setEstadisticas({
    metodosActivos: metodosActivos.length,
    comisionPromedio: comisionPromedio.toFixed(2),
    descuentoPromedio: descuentoPromedio.toFixed(2),
    limitePromedio: limitePromedio.toFixed(0),
  })
}, [metodosPago])

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto)
    setTipoMensaje(tipo)
    setTimeout(() => {
      setMensaje("")
      setTipoMensaje("")
    }, 3000)
  }

  const toggleActivo = (id) => {
    setMetodosPago(metodosPago.map((m) => (m.id === id ? { ...m, activo: !m.activo } : m)))
    mostrarMensaje("Estado del método actualizado", "success")
  }

  const handleEditar = (id) => {
    setMetodosPago(metodosPago.map((m) => (m.id === id ? { ...m, editando: true } : { ...m, editando: false })))
  }

  const handleCancelarEdicion = (id) => {
    setMetodosPago(metodosPago.map((m) => (m.id === id ? { ...m, editando: false } : m)))
  }

  const handleGuardar = (id, campo, valor) => {
    setMetodosPago(
      metodosPago.map((m) =>
        m.id === id
          ? {
              ...m,
              [campo]: ["comision", "limiteMin", "limiteMax", "descuento"].includes(campo)
                ? Number.parseFloat(valor) || 0
                : valor,
            }
          : m,
      ),
    )
  }

  const handleGuardarTodo = (id) => {
    const metodo = metodosPago.find((m) => m.id === id)
    if (!metodo.nombre || !metodo.descripcion) {
      mostrarMensaje("Por favor completa todos los campos", "error")
      return
    }
    setMetodosPago(metodosPago.map((m) => (m.id === id ? { ...m, editando: false } : m)))
    mostrarMensaje("Método de pago actualizado", "success")
  }

  const handleAgregarMetodo = () => {
    if (!nuevoMetodo.nombre || !nuevoMetodo.descripcion) {
      mostrarMensaje("Por favor completa todos los campos", "error")
      return
    }

    const nuevo = {
      ...nuevoMetodo,
      id: Date.now(),
      icon: getCategoriaIcon(nuevoMetodo.categoria),
      activo: true,
      editando: false,
    }
    setMetodosPago([...metodosPago, nuevo])
    setNuevoMetodo({
      nombre: "",
      descripcion: "",
      categoria: "digital",
      comision: 0,
      limiteMin: 1,
      limiteMax: 1000,
      descuento: 0,
    })
    mostrarMensaje("Nuevo método de pago agregado", "success")
  }

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case "digital":
        return <Smartphone size={20} />
      case "tarjeta":
        return <CreditCard size={20} />
      case "bancario":
        return <Building size={20} />
      case "efectivo":
        return <Banknote size={20} />
      case "agente":
        return <Globe size={20} />
      default:
        return <Wallet size={20} />
    }
  }

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case "digital":
        return "info"
      case "tarjeta":
        return "primary"
      case "bancario":
        return "success"
      case "efectivo":
        return "warning"
      case "agente":
        return "secondary"
      default:
        return "primary"
    }
  }

  const handleConfiguracion = (campo, valor) => {
    setConfiguracion({ ...configuracion, [campo]: Number.parseFloat(valor) || valor })
    mostrarMensaje("Configuración actualizada", "success")
  }

  return (
    <div className="config-pagos-container">
      <div className="config-header">
        <div className="header-content">
          <div className="header-info">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Configuración</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Métodos de Pago</span>
            </div>
            <h1 className="config-title">Configuración de Pagos</h1>
            <p className="config-subtitle">Gestiona los métodos de pago, comisiones y configuraciones</p>
          </div>
          <div className="header-icon">
            <CreditCard size={32} />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.metodosActivos}</div>
            <div className="stat-label">Métodos Activos</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <Percent size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.comisionPromedio}%</div>
            <div className="stat-label">Comisión Promedio</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.descuentoPromedio}%</div>
            <div className="stat-label">Descuento Promedio</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">S/ {estadisticas.limitePromedio}</div>
            <div className="stat-label">Límite Promedio</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Tabla de Métodos */}
        <div className="content-card main-table">
          <div className="card-header">
            <div className="card-title">
              <Wallet className="title-icon" />
              <h3>Métodos de Pago</h3>
            </div>
            <div className="card-count">{metodosPago.length} métodos configurados</div>
          </div>

          <div className="table-container">
            <table className="pagos-table">
              <thead>
                <tr>
                  <th className="th-metodo">Método</th>
                  <th className="th-comision">Comisión</th>
                  <th className="th-limites">Límites</th>
                  <th className="th-descuento">Descuento</th>
                  <th className="th-estado">Estado</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {metodosPago.map((metodo, index) => (
                  <tr key={metodo.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="td-metodo">
                      <div className="metodo-info">
                        <div className={`metodo-icon ${getCategoriaColor(metodo.categoria)}`}>{metodo.icon}</div>
                        <div className="metodo-details">
                          {metodo.editando ? (
                            <input
                              type="text"
                              value={metodo.nombre}
                              onChange={(e) => handleGuardar(metodo.id, "nombre", e.target.value)}
                              className="edit-input"
                              placeholder="Nombre del método"
                            />
                          ) : (
                            <div className="metodo-name">{metodo.nombre}</div>
                          )}
                          {metodo.editando ? (
                            <input
                              type="text"
                              value={metodo.descripcion}
                              onChange={(e) => handleGuardar(metodo.id, "descripcion", e.target.value)}
                              className="edit-input small"
                              placeholder="Descripción"
                            />
                          ) : (
                            <div className="metodo-description">{metodo.descripcion}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="td-comision">
                      {metodo.editando ? (
                        <div className="input-group">
                          <input
                            type="number"
                            value={metodo.comision}
                            onChange={(e) => handleGuardar(metodo.id, "comision", e.target.value)}
                            className="edit-input"
                            placeholder="0.00"
                            min="0"
                            step="0.1"
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      ) : (
                        <div className="comision-display">
                          <Percent size={14} />
                          <span>{metodo.comision}%</span>
                        </div>
                      )}
                    </td>
                    <td className="td-limites">
                      {metodo.editando ? (
                        <div className="limites-edit">
                          <div className="input-group small">
                            <span className="input-prefix">S/</span>
                            <input
                              type="number"
                              value={metodo.limiteMin}
                              onChange={(e) => handleGuardar(metodo.id, "limiteMin", e.target.value)}
                              className="edit-input"
                              placeholder="Min"
                              min="0"
                            />
                          </div>
                          <span className="separator">-</span>
                          <div className="input-group small">
                            <span className="input-prefix">S/</span>
                            <input
                              type="number"
                              value={metodo.limiteMax}
                              onChange={(e) => handleGuardar(metodo.id, "limiteMax", e.target.value)}
                              className="edit-input"
                              placeholder="Max"
                              min="0"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="limites-display">
                          <DollarSign size={14} />
                          <span>
                            S/ {metodo.limiteMin} - S/ {metodo.limiteMax}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="td-descuento">
                      {metodo.editando ? (
                        <div className="input-group">
                          <input
                            type="number"
                            value={metodo.descuento}
                            onChange={(e) => handleGuardar(metodo.id, "descuento", e.target.value)}
                            className="edit-input"
                            placeholder="0.00"
                            min="0"
                            step="0.1"
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      ) : (
                        <div className="descuento-display">
                          {metodo.descuento > 0 ? (
                            <>
                              <TrendingUp size={14} />
                              <span className="descuento-value">{metodo.descuento}%</span>
                            </>
                          ) : (
                            <span className="no-descuento">Sin descuento</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="td-estado">
                      <button
                        className={`status-toggle ${metodo.activo ? "active" : "inactive"}`}
                        onClick={() => toggleActivo(metodo.id)}
                        disabled={metodo.editando}
                      >
                        <div className="status-dot"></div>
                        <span>{metodo.activo ? "Activo" : "Inactivo"}</span>
                      </button>
                    </td>
                    <td className="td-acciones">
                      <div className="actions-group">
                        {metodo.editando ? (
                          <>
                            <button className="btn btn-save" onClick={() => handleGuardarTodo(metodo.id)}>
                              <Save size={14} />
                            </button>
                            <button className="btn btn-cancel" onClick={() => handleCancelarEdicion(metodo.id)}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-edit" onClick={() => handleEditar(metodo.id)}>
                            <Edit size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Agregar Nuevo Método */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <Plus className="title-icon" />
                <h3>Nuevo Método</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">
                  <Wallet size={16} />
                  Nombre del Método
                </label>
                <input
                  type="text"
                  placeholder="Ej: PayPal"
                  value={nuevoMetodo.nombre}
                  onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, nombre: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Settings size={16} />
                  Categoría
                </label>
                <select
                  value={nuevoMetodo.categoria}
                  onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, categoria: e.target.value })}
                  className="form-select"
                >
                  <option value="digital">Digital</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="bancario">Bancario</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="agente">Agente</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <AlertCircle size={16} />
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción del método de pago"
                  value={nuevoMetodo.descripcion}
                  onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, descripcion: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Percent size={16} />
                    Comisión (%)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={nuevoMetodo.comision}
                    onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, comision: e.target.value })}
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <TrendingUp size={16} />
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={nuevoMetodo.descuento}
                    onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, descuento: e.target.value })}
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Límite Mín. (S/)</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={nuevoMetodo.limiteMin}
                    onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, limiteMin: e.target.value })}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Límite Máx. (S/)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={nuevoMetodo.limiteMax}
                    onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, limiteMax: e.target.value })}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAgregarMetodo}>
                <Plus size={16} />
                Agregar Método
              </button>
            </div>
          </div>

          {/* Configuración General */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <Settings className="title-icon" />
                <h3>Configuración General</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="config-group">
                <div className="config-item">
                  <div className="config-label">
                    <Globe size={16} />
                    <span>Moneda Principal</span>
                  </div>
                  <select
                    value={configuracion.monedaPrincipal}
                    onChange={(e) => handleConfiguracion("monedaPrincipal", e.target.value)}
                    className="config-select"
                  >
                    <option value="PEN">Soles (PEN)</option>
                    <option value="USD">Dólares (USD)</option>
                    <option value="EUR">Euros (EUR)</option>
                  </select>
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Percent size={16} />
                    <span>IVA (%)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.iva}
                    onChange={(e) => handleConfiguracion("iva", e.target.value)}
                    className="config-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Calculator size={16} />
                    <span>Comisión General (%)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.comisionGeneral}
                    onChange={(e) => handleConfiguracion("comisionGeneral", e.target.value)}
                    className="config-input"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <TrendingUp size={16} />
                    <span>Descuento Máximo (%)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.descuentoMaximo}
                    onChange={(e) => handleConfiguracion("descuentoMaximo", e.target.value)}
                    className="config-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Shield size={16} />
                    <span>Límite Transacción (S/)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.limiteTransaccion}
                    onChange={(e) => handleConfiguracion("limiteTransaccion", e.target.value)}
                    className="config-input"
                    min="0"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Clock size={16} />
                    <span>Tiempo Expiración (hrs)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.tiempoExpiracion}
                    onChange={(e) => handleConfiguracion("tiempoExpiracion", e.target.value)}
                    className="config-input"
                    min="1"
                    max="168"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de notificación */}
      {mensaje && (
        <div className={`message-container ${tipoMensaje}`}>
          <div className="message-content">
            <div className="message-icon">
              {tipoMensaje === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <span className="message-text">{mensaje}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigPagos