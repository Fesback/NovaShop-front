import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, ArrowLeft, ImageIcon, AlertCircle } from "lucide-react"
import axios from "axios";
import "../../../styles/CrearCategoria.css";

function CrearCategoria() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Limpiar error en tiempo real
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    } else if (form.nombre.length < 3 || form.nombre.length > 50) {
      newErrors.nombre = "Debe tener entre 3 y 50 caracteres"
    }

    if (form.descripcion.length > 255) {
      newErrors.descripcion = "Máximo 255 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)

    try {
      const token = localStorage.getItem("token")

      await axios.post("http://localhost:8080/api/categorias", form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("✅ Categoría creada exitosamente")
      navigate("/admin/categorias/listar")
    } catch (err) {
      console.error("Error al crear categoría:", err)
      alert("❌ Error al crear la categoría")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({
      nombre: "",
      descripcion: "",
      imagen: "",
    })
    setErrors({})
  }

  return (
    <div className="crear-categoria-container">
      <div className="header-section">
        <button
          className="back-button"
          onClick={() => navigate("/admin/categorias/listar")}
          title="Volver a categorías"
        >
          <ArrowLeft className="back-icon" />
        </button>
        <div className="title-wrapper">
          <Plus className="title-icon" />
          <h2 className="page-title">Crear Nueva Categoría</h2>
        </div>
        <button className="reset-button" onClick={handleReset} title="Limpiar formulario" type="button">
          Limpiar
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-crear-categoria">
          <div className="form-grid">
            <div className="form-field">
              <label className="field-label">
                Nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`field-input ${errors.nombre ? "error" : ""}`}
                placeholder="Ingresa el nombre de la categoría"
                required
              />
              {errors.nombre && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  <span>{errors.nombre}</span>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="field-label">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className={`field-textarea ${errors.descripcion ? "error" : ""}`}
                placeholder="Describe la categoría (opcional)"
                rows="4"
              />
              {errors.descripcion && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  <span>{errors.descripcion}</span>
                </div>
              )}
              <div className="character-count">{form.descripcion.length}/255 caracteres</div>
            </div>

            <div className="form-field">
              <label className="field-label">URL de Imagen</label>
              <div className="image-input-wrapper">
                <input
                  type="text"
                  name="imagen"
                  value={form.imagen}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                />
                <div className="image-preview">
                  {form.imagen ? (
                    <img
                      src={form.imagen || "/placeholder.svg"}
                      alt="Vista previa"
                      className="preview-image"
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : (
                    <div className="no-preview">
                      <ImageIcon className="no-preview-icon" />
                      <span>Sin imagen</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/admin/categorias/listar")}
              disabled={submitting}
              title="Cancelar creación"
            >
              <X className="button-icon" />
              <span className="button-text">Cancelar</span>
            </button>
            <button type="submit" className="submit-button" disabled={submitting} title="Crear categoría">
              <Plus className="button-icon" />
              <span className="button-text">{submitting ? "Creando..." : "Crear Categoría"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preview card */}
      {(form.nombre || form.descripcion || form.imagen) && (
        <div className="preview-container">
          <h3 className="preview-title">Vista Previa</h3>
          <div className="category-preview-card">
            <div className="preview-card-image">
              {form.imagen ? (
                <img
                  src={form.imagen || "/placeholder.svg"}
                  alt="Vista previa de categoría"
                  className="card-image"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
              ) : (
                <div className="card-no-image">
                  <ImageIcon className="card-no-image-icon" />
                </div>
              )}
            </div>
            <div className="preview-card-content">
              <h4 className="card-name">{form.nombre || "Nombre de la categoría"}</h4>
              <p className="card-description">{form.descripcion || "Descripción de la categoría"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrearCategoria