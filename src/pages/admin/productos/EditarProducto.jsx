import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/EditarProducto.css"; 

function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
  })

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // 1. Obtener producto por ID
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get(`http://localhost:8080/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setForm(response.data)
      } catch (err) {
        console.error("Error al cargar el producto:", err)
        alert("Error al cargar los datos")
      }
    }

    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categorias")
        setCategorias(response.data)
      } catch (err) {
        console.error("Error al cargar categorías:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
    fetchCategorias()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!form.precio || form.precio <= 0) newErrors.precio = "El precio debe ser mayor a 0"
    if (!form.stock || form.stock < 0) newErrors.stock = "El stock no puede ser negativo"
    if (!form.categoriaId) newErrors.categoriaId = "Debe seleccionar una categoría"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const showSuccessNotification = () => {
    const notification = document.createElement("div")
    notification.className = "success-notification"
    notification.textContent = "Producto actualizado correctamente"
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      const token = localStorage.getItem("token")

      await axios.put(`http://localhost:8080/api/productos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      showSuccessNotification()

      setTimeout(() => {
        navigate("/admin/productos/listar")
      }, 1500)
    } catch (err) {
      console.error("Error al actualizar producto:", err)
      alert("Error al actualizar producto")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="editar-producto-container">
      <div className="editar-producto-wrapper">
        {/* Header */}
        <div className="header-section">
          <button onClick={() => navigate("/admin/productos/listar")} className="back-button">
            <span className="back-button-icon">←</span>
            Volver a productos
          </button>

          <div className="header-divider">
            <h1 className="header-title">
              <span className="header-icon">📦</span>
              Editar Producto
            </h1>
            <p className="header-subtitle">Modifica la información del producto</p>
          </div>
        </div>

        {/* Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form-content">
            {/* Nombre */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-icon">🏷️</span>
                Nombre del Producto
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`form-input ${errors.nombre ? "error" : ""}`}
                placeholder="Ingresa el nombre del producto"
                required
              />
              {errors.nombre && <p className="error-message">{errors.nombre}</p>}
            </div>

            {/* Descripción */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className={`form-textarea ${errors.descripcion ? "error" : ""}`}
                placeholder="Describe las características del producto"
                required
              />
              {errors.descripcion && <p className="error-message">{errors.descripcion}</p>}
            </div>

            {/* Precio y Stock */}
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <span className="label-icon">💰</span>
                  Precio
                </label>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.precio ? "error" : ""}`}
                  placeholder="0.00"
                  required
                />
                {errors.precio && <p className="error-message">{errors.precio}</p>}
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-icon">#️⃣</span>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  className={`form-input ${errors.stock ? "error" : ""}`}
                  placeholder="0"
                  required
                />
                {errors.stock && <p className="error-message">{errors.stock}</p>}
              </div>
            </div>

            {/* Categoría */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-icon">📂</span>
                Categoría
              </label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className={`form-select ${errors.categoriaId ? "error" : ""}`}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && <p className="error-message">{errors.categoriaId}</p>}
            </div>

            {/* Botones */}
            <div className="buttons-section">
              <button
                type="button"
                onClick={() => navigate("/admin/productos/listar")}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancelar
              </button>

              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarProducto