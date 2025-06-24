import { useState } from "react";
import axios from "axios";
import { ArrowLeft, X, Save, CheckCircle, AlertCircle, UserPlus, User, Phone, MapPin, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom";
import "../../../styles/CrearUsuario.css";

function CrearUsuario() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
    contrasena: "",
  })
  const [mensaje, setMensaje] = useState("")
  const [saving, setSaving] = useState(false)
  const [tipoMensaje, setTipoMensaje] = useState("")

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

      await axios.post("http://localhost:8080/api/usuarios", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMensaje("Usuario creado correctamente")
      setTipoMensaje("success")
      setTimeout(() => navigate("/admin/usuarios/listar"), 1500)
    } catch (err) {
      console.error("Error al crear usuario:", err)
      setMensaje("Error al crear usuario")
      setTipoMensaje("error")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin/usuarios/listar")
  }

  const resetForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      email: "",
      direccion: "",
      telefono: "",
      contrasena: "",
    })
    setMensaje("")
    setTipoMensaje("")
  }

  return (
    <div className="crear-container">
      <div className="crear-header">
        <div className="header-content">
          <div className="header-info">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Usuarios</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Crear Usuario</span>
            </div>
            <h1 className="crear-title">Crear Nuevo Usuario</h1>
            <p className="crear-subtitle">Registra un nuevo usuario en el sistema</p>
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
                <UserPlus size={24} />
              </div>
              <div className="form-header-text">
                <h2 className="form-title">Información del Usuario</h2>
                <p className="form-description">Completa todos los campos requeridos</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crear-form">
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
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Correo Electrónico <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Contraseña <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa una contraseña segura"
                    required
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
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-reset">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Limpiar
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-cancel">
                <X size={16} />
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? (
                  <>
                    <div className="btn-spinner"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Crear Usuario
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

export default CrearUsuario