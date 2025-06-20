import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit3, Save, X, ArrowLeft, ImageIcon, AlertCircle } from "lucide-react"
import "../../../styles/EditarCategoria.css";

function EditarCategoria() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Obtener categoría por ID
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/categorias/${id}`)
        const data = response.data

        setForm({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          imagen: data.imagen || "",
        })
      } catch (err) {
        console.error("Error al obtener la categoría:", err)
        alert("Error al obtener datos de la categoría")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoria()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

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

      await axios.put(`http://localhost:8080/api/categorias/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("✅ Categoría actualizada correctamente")
      navigate("/admin/categorias/listar")
    } catch (err) {
      console.error("Error al actualizar la categoría:", err)
      alert("❌ No se pudo actualizar la categoría")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando datos de la categoría...</p>
      </div>
    )
  }

  return (
    <div className="editar-categoria-container">
      <div className="header-section">
        <button
          className="back-button"
          onClick={() => navigate("/admin/categorias/listar")}
          title="Volver a categorías"
        >
          <ArrowLeft className="back-icon" />
        </button>
        <div className="title-wrapper">
          <Edit3 className="title-icon" />
          <h2 className="page-title">Editar Categoría</h2>
        </div>
        <div className="category-id">ID: {id}</div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-editar-categoria">
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
                  placeholder="https://ejemplo.com/imagen.jpg"
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
              title="Cancelar edición"
            >
              <X className="button-icon" />
              <span className="button-text">Cancelar</span>
            </button>
            <button type="submit" className="submit-button" disabled={submitting} title="Guardar cambios">
              <Save className="button-icon" />
              <span className="button-text">{submitting ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarCategoria
