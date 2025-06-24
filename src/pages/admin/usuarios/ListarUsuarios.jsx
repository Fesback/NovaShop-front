import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../../../styles/ListarUsuarios.css"; 

function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsuarios(response.data)
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      alert("Error al obtener usuarios.")
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoUsuario = async (id, activo) => {
    const token = localStorage.getItem("token")
    const confirm = window.confirm(`¿Estás seguro de ${activo ? "desactivar" : "activar"} este usuario?`)
    if (!confirm) return

    try {
      const url = `http://localhost:8080/api/usuarios/${id}/${activo ? "desactivar" : "activar"}`
      await axios.patch(url, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert(`Usuario ${activo ? "desactivado" : "activado"} correctamente.`)
      fetchUsuarios()
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error)
      alert("No se pudo cambiar el estado del usuario.")
    }
  }

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1 className="usuarios-title">Gestión de Usuarios</h1>
        <p className="usuarios-subtitle">Administra y controla el acceso de los usuarios del sistema</p>
      </div>

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No hay usuarios registrados</h3>
          <p>Aún no se han registrado usuarios en el sistema.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">
              <h2>Lista de Usuarios</h2>
              <p className="table-count">{usuarios.length} usuarios encontrados</p>
            </div>
          </div>

          <table className="usuarios-table">
            <thead>
              <tr>
                <th className="th-id">ID</th>
                <th className="th-usuario">Usuario</th>
                <th className="th-contacto">Contacto</th>
                <th className="th-estado">Estado</th>
                <th className="th-roles">Roles</th>
                <th className="th-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td className="td-id">
                    <span className="id-badge">#{usuario.idUsuario}</span>
                  </td>
                  <td className="td-usuario">
                    <div className="user-info">
                      <div className="user-avatar">{usuario.nombre.charAt(0).toUpperCase()}</div>
                      <div className="user-details">
                        <div className="user-name">
                          {usuario.nombre} {usuario.apellido}
                        </div>
                        <div className="user-email">{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-contacto">
                    <div className="contact-cell">
                      <span className="phone-number">{usuario.telefono}</span>
                    </div>
                  </td>
                  <td className="td-estado">
                    <span className={`status-badge ${usuario.activo ? "active" : "inactive"}`}>
                      <span className="status-dot"></span>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="td-roles">
                    <div className="roles-container">
                      {usuario.roles.map((rol, index) => (
                        <span key={index} className="role-tag">
                          {rol}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="td-acciones">
                    <div className="actions-container">
                      <Link to={`/admin/usuarios/editar/${usuario.idUsuario}`} className="btn btn-edit">
                        <span className="btn-icon">✏️</span>
                        Editar
                      </Link>
                      <button
                        className={`btn ${usuario.activo ? "btn-deactivate" : "btn-activate"}`}
                        onClick={() => cambiarEstadoUsuario(usuario.idUsuario, usuario.activo)}
                      >
                        <span className="btn-icon">{usuario.activo ? "🔒" : "🔓"}</span>
                        {usuario.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            <p className="results-count">
              Mostrando <strong>{usuarios.length}</strong> usuario{usuarios.length !== 1 ? "s" : ""} en total
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListarUsuarios