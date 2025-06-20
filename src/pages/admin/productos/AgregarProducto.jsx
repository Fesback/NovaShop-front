import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../../styles/AgregarProducto.css"; 

function AgregarProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoriaId: "",
  })

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Obtener categorías al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categorias")
      .then((res) => {
        setCategorias(res.data)
      })
      .catch((err) => {
        console.error("Error al obtener categorías:", err)
      })
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!form.precio || form.precio <= 0) newErrors.precio = "El precio debe ser mayor a 0"
    if (!form.stock || form.stock < 0) newErrors.stock = "El stock no puede ser negativo"
    if (!form.categoriaId) newErrors.categoriaId = "Selecciona una categoría"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post("http://localhost:8080/api/productos", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Producto creado:", response.data)

      // Mostrar mensaje de éxito más elegante
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.textContent = "Producto creado correctamente"
      document.body.appendChild(successMessage)

      setTimeout(() => {
        document.body.removeChild(successMessage)
        navigate("/admin/productos/listar")
      }, 2000)
    } catch (err) {
      console.error("Error al crear producto:", err)

      // Mostrar mensaje de error más elegante
      const errorMessage = document.createElement("div")
      errorMessage.className = "error-message"
      errorMessage.textContent = "Error al crear producto. Intenta nuevamente."
      document.body.appendChild(errorMessage)

      setTimeout(() => {
        document.body.removeChild(errorMessage)
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="agregar-producto-container">
      <div className="form-header">
        <h1 className="form-title">Agregar Nuevo Producto</h1>
        <p className="form-subtitle">Completa la información del producto</p>
      </div>

      <form className="producto-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Nombre del Producto
              <span className="required">*</span>
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
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Categoría
              <span className="required">*</span>
            </label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className={`form-select ${errors.categoriaId ? "error" : ""}`}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && <span className="error-text">{errors.categoriaId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Precio
              <span className="required">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              className={`form-input ${errors.precio ? "error" : ""}`}
              placeholder="0.00"
              required
            />
            {errors.precio && <span className="error-text">{errors.precio}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Stock
              <span className="required">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className={`form-input ${errors.stock ? "error" : ""}`}
              placeholder="Cantidad disponible"
              required
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Describe las características del producto..."
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Imagen</label>
          <input
            type="text"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            className="form-input"
            placeholder="URL de la imagen o nombre del archivo"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/productos/listar")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className={`btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : (
              "Crear Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AgregarProducto
