import { useState, useEffect } from "react";
import { Plus,
  Trash2,
  Edit,
  Save,
  X,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Settings,
  CheckCircle,
  AlertCircle,
  Globe,
  Calculator,
  Calendar,
  Weight,
  Zap,} from "lucide-react";
  import "../../../styles/ConfigEnvios.css";


function ConfigEnvios() {
  const [zonasEnvio, setZonasEnvio] = useState([
    { id: 1, zona: "Lima Metropolitana", costo: 10, tiempo: "1-2 días", activo: true, editando: false },
    { id: 2, zona: "Lima Provincias", costo: 15, tiempo: "2-3 días", activo: true, editando: false },
    { id: 3, zona: "Arequipa", costo: 25, tiempo: "3-4 días", activo: true, editando: false },
    { id: 4, zona: "Cusco", costo: 30, tiempo: "4-5 días", activo: true, editando: false },
    { id: 5, zona: "Trujillo", costo: 20, tiempo: "3-4 días", activo: false, editando: false },
  ])

  const [nuevaZona, setNuevaZona] = useState({ zona: "", costo: "", tiempo: "" })
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  const [configuracion, setConfiguracion] = useState({
    envioGratis: 100,
    pesoMaximo: 30,
    diasEntrega: 7,
    costoBase: 5,
    incrementoPorKg: 2,
  })

  const [estadisticas, setEstadisticas] = useState({
    totalZonas: 0,
    zonasActivas: 0,
    costoPromedio: 0,
    tiempoPromedio: 0,
  })

  useEffect(() => {
  const zonasActivas = zonasEnvio.filter((z) => z.activo)
  const costoPromedio =
    zonasActivas.reduce((sum, z) => sum + Number.parseFloat(z.costo), 0) / zonasActivas.length || 0
  const tiempoPromedio =
    zonasActivas.reduce((sum, z) => {
      const dias = Number.parseInt(z.tiempo.split("-")[0]) || 0
      return sum + dias
    }, 0) / zonasActivas.length || 0

  setEstadisticas({
    totalZonas: zonasEnvio.length,
    zonasActivas: zonasActivas.length,
    costoPromedio: costoPromedio.toFixed(2),
    tiempoPromedio: Math.round(tiempoPromedio),
  })
}, [zonasEnvio])

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto)
    setTipoMensaje(tipo)
    setTimeout(() => {
      setMensaje("")
      setTipoMensaje("")
    }, 3000)
  }

  const handleAgregar = () => {
    if (!nuevaZona.zona || !nuevaZona.costo || !nuevaZona.tiempo) {
      mostrarMensaje("Por favor completa todos los campos", "error")
      return
    }

    if (Number.parseFloat(nuevaZona.costo) <= 0) {
      mostrarMensaje("El costo debe ser mayor a 0", "error")
      return
    }

    const nueva = {
      ...nuevaZona,
      id: Date.now(),
      costo: Number.parseFloat(nuevaZona.costo),
      activo: true,
      editando: false,
    }
    setZonasEnvio([...zonasEnvio, nueva])
    setNuevaZona({ zona: "", costo: "", tiempo: "" })
    mostrarMensaje("Zona de envío agregada correctamente", "success")
  }

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta zona de envío?")) {
      setZonasEnvio(zonasEnvio.filter((z) => z.id !== id))
      mostrarMensaje("Zona de envío eliminada", "success")
    }
  }

  const handleEditar = (id) => {
    setZonasEnvio(zonasEnvio.map((z) => (z.id === id ? { ...z, editando: true } : { ...z, editando: false })))
  }

  const handleCancelarEdicion = (id) => {
    setZonasEnvio(zonasEnvio.map((z) => (z.id === id ? { ...z, editando: false } : z)))
  }

  const handleGuardar = (id, campo, valor) => {
    setZonasEnvio(
      zonasEnvio.map((z) =>
        z.id === id ? { ...z, [campo]: campo === "costo" ? Number.parseFloat(valor) || 0 : valor } : z,
      ),
    )
  }

  const handleGuardarTodo = (id) => {
    const zona = zonasEnvio.find((z) => z.id === id)
    if (!zona.zona || !zona.costo || !zona.tiempo) {
      mostrarMensaje("Por favor completa todos los campos", "error")
      return
    }
    setZonasEnvio(zonasEnvio.map((z) => (z.id === id ? { ...z, editando: false } : z)))
    mostrarMensaje("Zona actualizada correctamente", "success")
  }

  const toggleActivo = (id) => {
    setZonasEnvio(zonasEnvio.map((z) => (z.id === id ? { ...z, activo: !z.activo } : z)))
    mostrarMensaje("Estado de zona actualizado", "success")
  }

  const handleConfiguracion = (campo, valor) => {
    setConfiguracion({ ...configuracion, [campo]: Number.parseFloat(valor) || 0 })
    mostrarMensaje("Configuración actualizada", "success")
  }

  return (
    <div className="config-envios-container">
      <div className="config-header">
        <div className="header-content">
          <div className="header-info">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Configuración</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Envíos</span>
            </div>
            <h1 className="config-title">Configuración de Envíos</h1>
            <p className="config-subtitle">Gestiona las zonas de envío, costos y tiempos de entrega</p>
          </div>
          <div className="header-icon">
            <Truck size={32} />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Globe size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.totalZonas}</div>
            <div className="stat-label">Total Zonas</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.zonasActivas}</div>
            <div className="stat-label">Zonas Activas</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">S/ {estadisticas.costoPromedio}</div>
            <div className="stat-label">Costo Promedio</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.tiempoPromedio} días</div>
            <div className="stat-label">Tiempo Promedio</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Tabla de Zonas */}
        <div className="content-card main-table">
          <div className="card-header">
            <div className="card-title">
              <MapPin className="title-icon" />
              <h3>Zonas de Envío</h3>
            </div>
            <div className="card-count">{zonasEnvio.length} zonas configuradas</div>
          </div>

          <div className="table-container">
            <table className="config-table">
              <thead>
                <tr>
                  <th className="th-zona">Zona</th>
                  <th className="th-costo">Costo</th>
                  <th className="th-tiempo">Tiempo</th>
                  <th className="th-estado">Estado</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {zonasEnvio.map((zona, index) => (
                  <tr key={zona.id}  style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="td-zona">
                      {zona.editando ? (
                        <input
                          type="text"
                          value={zona.zona}
                          onChange={(e) => handleGuardar(zona.id, "zona", e.target.value)}
                          className="edit-input"
                          placeholder="Nombre de la zona"
                        />
                      ) : (
                        <div className="zona-info">
                          <div className="zona-icon">
                            <MapPin size={16} />
                          </div>
                          <span className="zona-name">{zona.zona}</span>
                        </div>
                      )}
                    </td>
                    <td className="td-costo">
                      {zona.editando ? (
                        <div className="input-group">
                          <span className="input-prefix">S/</span>
                          <input
                            type="number"
                            value={zona.costo}
                            onChange={(e) => handleGuardar(zona.id, "costo", e.target.value)}
                            className="edit-input"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      ) : (
                        <div className="costo-display">
                          <DollarSign size={14} />
                          <span>S/ {zona.costo.toFixed(2)}</span>
                        </div>
                      )}
                    </td>
                    <td className="td-tiempo">
                      {zona.editando ? (
                        <input
                          type="text"
                          value={zona.tiempo}
                          onChange={(e) => handleGuardar(zona.id, "tiempo", e.target.value)}
                          className="edit-input"
                          placeholder="1-2 días"
                        />
                      ) : (
                        <div className="tiempo-display">
                          <Clock size={14} />
                          <span>{zona.tiempo}</span>
                        </div>
                      )}
                    </td>
                    <td className="td-estado">
                      <button
                        className={`status-toggle ${zona.activo ? "active" : "inactive"}`}
                        onClick={() => toggleActivo(zona.id)}
                        disabled={zona.editando}
                      >
                        <div className="status-dot"></div>
                        <span>{zona.activo ? "Activo" : "Inactivo"}</span>
                      </button>
                    </td>
                    <td className="td-acciones">
                      <div className="actions-group">
                        {zona.editando ? (
                          <>
                            <button className="btn btn-save" onClick={() => handleGuardarTodo(zona.id)}>
                              <Save size={14} />
                            </button>
                            <button className="btn btn-cancel" onClick={() => handleCancelarEdicion(zona.id)}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-edit" onClick={() => handleEditar(zona.id)}>
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-delete" onClick={() => handleEliminar(zona.id)}>
                              <Trash2 size={14} />
                            </button>
                          </>
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
          {/* Agregar Nueva Zona */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <Plus className="title-icon" />
                <h3>Nueva Zona</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} />
                  Zona de Envío
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lima Norte"
                  value={nuevaZona.zona}
                  onChange={(e) => setNuevaZona({ ...nuevaZona, zona: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  Costo (S/)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={nuevaZona.costo}
                  onChange={(e) => setNuevaZona({ ...nuevaZona, costo: e.target.value })}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} />
                  Tiempo Estimado
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1-2 días"
                  value={nuevaZona.tiempo}
                  onChange={(e) => setNuevaZona({ ...nuevaZona, tiempo: e.target.value })}
                  className="form-input"
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAgregar}>
                <Plus size={16} />
                Agregar Zona
              </button>
            </div>
          </div>

          {/* Configuración Avanzada */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-title">
                <Settings className="title-icon" />
                <h3>Configuración</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="config-group">
                <div className="config-item">
                  <div className="config-label">
                    <Zap size={16} />
                    <span>Envío Gratis desde</span>
                  </div>
                  <div className="input-group">
                    <span className="input-prefix">S/</span>
                    <input
                      type="number"
                      value={configuracion.envioGratis}
                      onChange={(e) => handleConfiguracion("envioGratis", e.target.value)}
                      className="config-input"
                      min="0"
                    />
                  </div>
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Weight size={16} />
                    <span>Peso Máximo (kg)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.pesoMaximo}
                    onChange={(e) => handleConfiguracion("pesoMaximo", e.target.value)}
                    className="config-input"
                    min="0"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Calendar size={16} />
                    <span>Días Máx. Entrega</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.diasEntrega}
                    onChange={(e) => handleConfiguracion("diasEntrega", e.target.value)}
                    className="config-input"
                    min="1"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Package size={16} />
                    <span>Costo Base (S/)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.costoBase}
                    onChange={(e) => handleConfiguracion("costoBase", e.target.value)}
                    className="config-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Calculator size={16} />
                    <span>Incremento por kg (S/)</span>
                  </div>
                  <input
                    type="number"
                    value={configuracion.incrementoPorKg}
                    onChange={(e) => handleConfiguracion("incrementoPorKg", e.target.value)}
                    className="config-input"
                    min="0"
                    step="0.01"
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

export default ConfigEnvios