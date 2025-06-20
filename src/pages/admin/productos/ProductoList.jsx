import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../../styles/ProductoList.css" 

function ProductoList() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos")
        const data = await response.json()
        setProductos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener productos:", error)
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const handleEliminar = async (idProducto) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este producto?")
    if (!confirmar) return

    try {
      const token = localStorage.getItem("token")

      await fetch(`http://localhost:8080/api/productos/${idProducto}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProductos((prev) => prev.filter((p) => p.idProducto !== idProducto))
      alert("Producto eliminado correctamente")

      const newTotalPages = Math.ceil((productos.length - 1) / itemsPerPage)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      alert("No se pudo eliminar el producto")
    }
  }

  // Cálculos de paginación
  const totalPages = Math.ceil(productos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = productos.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }

    return pages
  }

  if (loading) {
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-content">
      {/* Header Section */}
      <div className="content-header">
        <div className="header-left">
          <h1 className="page-title">Gestión de Productos</h1>
          <p className="page-subtitle">Administra tu inventario de manera eficiente</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9"></path>
              <path d="M14 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{productos.length}</div>
            <div className="stat-label">Total Productos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{productos.filter((p) => p.activo).length}</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{productos.filter((p) => p.stock <= 10).length}</div>
            <div className="stat-label">Stock Bajo</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{productos.filter((p) => !p.activo).length}</div>
            <div className="stat-label">Inactivos</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">
            <h2>Lista de Productos</h2>
            <span className="table-count">{productos.length} productos</span>
          </div>
          <div className="table-filters">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input type="text" placeholder="Buscar productos..." />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th className="th-id">ID</th>
                <th className="th-product">PRODUCTO</th>
                <th className="th-category">CATEGORÍA</th>
                <th className="th-price">PRECIO</th>
                <th className="th-stock">STOCK</th>
                <th className="th-status">ESTADO</th>
                <th className="th-actions">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((producto, index) => (
                <tr key={producto.idProducto}  style={{ animationDelay: `${index * 0.1}s` }}>
                  <td className="td-id">
                    <div className="id-badge">{producto.idProducto}</div>
                  </td>
                  <td className="td-product">
                    <div className="product-cell">
                      <div className="product-avatar">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 7h-9"></path>
                          <path d="M14 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"></path>
                        </svg>
                      </div>
                      <div className="product-info">
                        <div className="product-name">{producto.nombre}</div>
                        <div className="product-sku">SKU: {producto.idProducto}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-category">
                    <span className="category-badge">{producto.nombreCategoria}</span>
                  </td>
                  <td className="td-price">
                    <div className="price-cell">
                      <span className="currency">S/</span>
                      <span className="amount">{producto.precio?.toFixed(2) || "0.00"}</span>
                    </div>
                  </td>
                  <td className="td-stock">
                    <div
                      className={`stock-badge ${
                        producto.stock <= 10 ? "low" : producto.stock <= 50 ? "medium" : "high"
                      }`}
                    >
                      <div className="stock-dot"></div>
                      <span>{producto.stock || 0}</span>
                    </div>
                  </td>
                  <td className="td-status">
                    <div className={`status-badge ${producto.activo ? "active" : "inactive"}`}>
                      <div className="status-dot"></div>
                      <span>{producto.activo ? "ACTIVO" : "INACTIVO"}</span>
                    </div>
                  </td>
                  <td className="td-actions">
                    <div className="action-group">
                      <button
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/productos/editar/${producto.idProducto}`)}
                        title="Editar producto"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleEliminar(producto.idProducto)}
                        title="Eliminar producto"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Mostrando{" "}
                <strong>
                  {startIndex + 1}-{Math.min(endIndex, productos.length)}
                </strong>{" "}
                de <strong>{productos.length}</strong> productos
              </span>
            </div>
            <div className="pagination-controls">
              <button
                className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
                Anterior
              </button>

              <div className="page-numbers">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {productos.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7h-9"></path>
              <path d="M14 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"></path>
            </svg>
          </div>
          <h3 className="empty-title">No hay productos disponibles</h3>
          <p className="empty-description">Comienza agregando tu primer producto al inventario</p>
          <button className="btn-primary" onClick={() => navigate("/admin/productos/agregar")}>
            Agregar Primer Producto
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductoList
