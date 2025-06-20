import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit2, Trash2, Folder, ImageIcon } from "lucide-react"
import "../../../styles/ListarCategorias.css"

function ListarCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categorias")
      setCategorias(response.data)
    } catch (err) {
      console.error("Error al obtener categorías:", err)
      alert("Error al obtener categorías")
    } finally {
      setLoading(false)
    }
  }

  const handleDesactivar = async (id) => {
    const confirm = window.confirm("¿Estás seguro de desactivar esta categoría?")
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:8080/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("✅ Categoría desactivada")
      fetchCategorias()
    } catch (err) {
      console.error("Error al desactivar categoría:", err)
      alert("❌ No se pudo desactivar la categoría")
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando categorías...</p>
      </div>
    )
  }

  return (
    <div className="listar-categorias-container">
      <div className="header-section">
        <div className="title-wrapper">
          <Folder className="title-icon" />
          <h2 className="page-title">Categorías</h2>
        </div>
        <div className="stats-badge">
          {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="tabla-categorias">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id}>
                  <td className="id-cell">{cat.id}</td>
                  <td className="name-cell">
                    <span className="category-name">{cat.nombre}</span>
                  </td>
                  <td className="description-cell">
                    <span className="description-text">{cat.descripcion}</span>
                  </td>
                  <td className="image-cell">
                    {cat.imagen ? (
                      <div className="image-wrapper">
                        <img src={cat.imagen || "/placeholder.svg"} alt={cat.nombre} className="category-image" />
                      </div>
                    ) : (
                      <div className="no-image">
                        <ImageIcon className="no-image-icon" />
                      </div>
                    )}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${cat.activo ? "active" : "inactive"}`}>
                      {cat.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/admin/categorias/editar/${cat.id}`)}
                        title="Editar categoría"
                      >
                        <Edit2 className="btn-icon" />
                      </button>
                      {cat.activo && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDesactivar(cat.id)}
                          title="Desactivar categoría"
                        >
                          <Trash2 className="btn-icon" />
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

      {categorias.length === 0 && (
        <div className="empty-state">
          <Folder className="empty-icon" />
          <h3 className="empty-title">No hay categorías</h3>
          <p className="empty-description">Aún no se han creado categorías en el sistema.</p>
        </div>
      )}
    </div>
  )
}

export default ListarCategorias
