import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Save, CheckCircle, AlertCircle, User, Phone, MapPin } from "lucide-react"
import axios from 'axios';
import "../../../styles/EditarUsuario.css"

function EditarUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  })
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tipoMensaje, setTipoMensaje] = useState("")

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get(`http://localhost:8080/api/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const { nombre, apellido, direccion, telefono } = response.data
        setForm({ nombre, apellido, direccion, telefono })
      } catch (err) {
        console.error("Error al obtener usuario:", err)
        setMensaje("Error al cargar el usuario")
        setTipoMensaje("error")
      } finally {
        setLoading(false)
      }
    }

    fetchUsuario()
  }, [id])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    // Limpiar mensaje cuando el usuario empiece a escribir
    if (mensaje) {
      setMensaje("")
      setTipoMensaje("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem("token")

      await axios.put(`http://localhost:8080/api/usuarios/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMensaje("Usuario actualizado correctamente")
      setTipoMensaje("success")
      setTimeout(() => navigate("/admin/usuarios/listar"), 1500)
    } catch (err) {
      console.error("Error al actualizar usuario:", err)
      setMensaje("Error al actualizar usuario")
      setTipoMensaje("error")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin/usuarios/listar")
  }

  if (loading) {
    return (
      <div className="editar-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="editar-container">
      <div className="editar-header">
        <div className="header-content">
          <div className="header-info">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Usuarios</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Editar Usuario</span>
            </div>
            <h1 className="editar-title">Editar Usuario</h1>
            <p className="editar-subtitle">Modifica la información del usuario #{id}</p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-content">
              <div className="form-header-icon">
                <User size={24} />
              </div>
              <div className="form-header-text">
                <h2 className="form-title">Información Personal</h2>
                <p className="form-description">Actualiza los datos del usuario</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="editar-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  <User size={16} />
                  Nombre <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa el nombre"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="apellido" className="form-label">
                  <User size={16} />
                  Apellido <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa el apellido"
                    required
                  />
                </div>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="direccion" className="form-label">
                  <MapPin size={16} />
                  Dirección
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa la dirección completa"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="telefono" className="form-label">
                  <Phone size={16} />
                  Teléfono
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa el número de teléfono"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn btn-cancel">
                <X size={16} />
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? (
                  <>
                    <div className="btn-spinner"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default EditarUsuario
