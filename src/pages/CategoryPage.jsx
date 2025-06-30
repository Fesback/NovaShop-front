import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductsByCategory } from '../services/productService';
import ProductCard from '../components/ProductCard';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  Package,
  Star,
  DollarSign,
  Tag,
  SlidersHorizontal,
} from "lucide-react"
import "../styles/CategoriasUser.css"

function CategoryPage() {
  const { categorySlug } = useParams()

  const navigate = useNavigate()

  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")

 
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)

 
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    price: true,
    features: false,
    rating: true,
  })

  const productsPerPage = 12

  // Configuración de categorías
  const categoryConfig = {
    laptops: {
      title: "Laptops",
      description: "Encuentra la laptop perfecta para trabajo, gaming o estudio",
      icon: "💻",
      gradient: "from-blue-600 to-purple-600",
      features: ["Procesador", "RAM", "Almacenamiento", "Pantalla"],
    },
    celulares: {
      title: "Celulares",
      description: "Los últimos smartphones con la mejor tecnología",
      icon: "📱",
      gradient: "from-green-600 to-blue-600",
      features: ["Cámara", "Batería", "Pantalla", "Almacenamiento"],
    },
    tablets: {
      title: "Tablets",
      description: "Tablets para productividad y entretenimiento",
      icon: "📱",
      gradient: "from-purple-600 to-pink-600",
      features: ["Pantalla", "Procesador", "Batería", "Conectividad"],
    },
    accesorios: {
      title: "Accesorios",
      description: "Complementa tus dispositivos con los mejores accesorios",
      icon: "🎧",
      gradient: "from-orange-600 to-red-600",
      features: ["Compatibilidad", "Calidad", "Durabilidad", "Diseño"],
    },
  }

  const currentCategory = categoryConfig[categorySlug] || {
    title: categorySlug?.charAt(0).toUpperCase() + categorySlug?.slice(1),
    description: "Explora nuestra selección de productos",
    icon: "📦",
    gradient: "from-gray-600 to-gray-800",
    features: [],
  }

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProductsByCategory(categorySlug)
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error:", error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [categorySlug])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por marcas
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.some((brand) => product.marca?.toLowerCase().includes(brand.toLowerCase())),
      )
    }

    // Filtro por precio
    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(product.precio) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Ordenamiento
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (Number.parseFloat(a.precio) || 0) - (Number.parseFloat(b.precio) || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (Number.parseFloat(b.precio) || 0) - (Number.parseFloat(a.precio) || 0))
        break
      case "name":
        filtered.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
        break
      case "popularity":
      default:
      
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, searchTerm, selectedBrands, priceRange, sortBy])

  // Obtener marcas únicas
  const availableBrands = [...new Set(products.map((p) => p.marca).filter(Boolean))]

  // Calcular estadísticas
  const stats = {
    totalProducts: filteredProducts.length,
    priceRange: {
      min: Math.min(...filteredProducts.map((p) => Number.parseFloat(p.precio) || 0)),
      max: Math.max(...filteredProducts.map((p) => Number.parseFloat(p.precio) || 0)),
    },
    avgRating: (filteredProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / filteredProducts.length || 0).toFixed(
      1,
    ),
    brandsCount: availableBrands.length,
  }

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Funciones de utilidad
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedBrands([])
    setPriceRange([0, 10000])
    setSortBy("popularity")
  }

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (loading) {
    return (
      <div className="catpage-wrapper">
        <div className="catpage-loading-state">
          <div className="catpage-loading-hero">
            <div className="catpage-skeleton catpage-hero-skeleton"></div>
          </div>
          <div className="catpage-loading-content">
            <div className="catpage-loading-sidebar">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="catpage-skeleton catpage-filter-skeleton"></div>
              ))}
            </div>
            <div className="catpage-loading-products">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="catpage-skeleton catpage-product-skeleton"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="catpage-wrapper">
      {/* Hero Section */}
      <div className={`catpage-hero bg-gradient-to-r ${currentCategory.gradient}`}>
        <div className="catpage-hero-content">
          <div className="catpage-hero-text">
            <div className="catpage-breadcrumb">
              <span onClick={() => navigate("/")} className="catpage-breadcrumb-item">
                Inicio
              </span>
              <span className="catpage-breadcrumb-separator">›</span>
              <span className="catpage-breadcrumb-item">Categorías</span>
              <span className="catpage-breadcrumb-separator">›</span>
              <span className="catpage-breadcrumb-item catpage-breadcrumb-active">{currentCategory.title}</span>
            </div>
            <h1 className="catpage-hero-title">
              <span className="catpage-hero-icon">{currentCategory.icon}</span>
              {currentCategory.title}
            </h1>
            <p className="catpage-hero-description">{currentCategory.description}</p>
            <div className="catpage-hero-stats">
              <div className="catpage-stat-item">
                <Package size={16} />
                <span>{stats.totalProducts} productos</span>
              </div>
              <div className="catpage-stat-item">
                <Star size={16} />
                <span>{stats.avgRating} rating promedio</span>
              </div>
              <div className="catpage-stat-item">
                <Tag size={16} />
                <span>{stats.brandsCount} marcas</span>
              </div>
            </div>
          </div>
          <div className="catpage-hero-visual">
            <div className="catpage-floating-cards">
              {currentProducts.slice(0, 3).map((product, index) => (
                <div key={product.idProducto} className={`catpage-floating-card catpage-card-${index + 1}`}>
                  <img src={product.imagenUrl || "/placeholder.svg"} alt={product.nombre} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="catpage-main-content">
        {/* Filters Sidebar */}
        <aside className={`catpage-filters-sidebar ${showFilters ? "catpage-mobile-open" : ""}`}>
          <div className="catpage-filters-header">
            <h3>Filtros</h3>
            <button className="catpage-clear-filters" onClick={clearFilters}>
              Limpiar todo
            </button>
          </div>

          {/* Search */}
          <div className="catpage-filter-section">
            <div className="catpage-search-container">
              <Search className="catpage-search-icon" size={16} />
              <input
                type="text"
                placeholder="Buscar en categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="catpage-search-input"
              />
              {searchTerm && (
                <button className="catpage-clear-search" onClick={() => setSearchTerm("")}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="catpage-filter-section">
            <div className="catpage-filter-header" onClick={() => toggleFilterSection("price")}>
              <h4>
                <DollarSign size={16} />
                Rango de Precio
              </h4>
              {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.price && (
              <div className="catpage-filter-content">
                <div className="catpage-price-range">
                  <div className="catpage-price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                      className="catpage-price-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 10000])}
                      className="catpage-price-input"
                    />
                  </div>
                  <div className="catpage-price-info">
                    <span>S/ {stats.priceRange.min.toLocaleString()}</span>
                    <span>S/ {stats.priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className="catpage-filter-section">
              <div className="catpage-filter-header" onClick={() => toggleFilterSection("brand")}>
                <h4>
                  <Tag size={16} />
                  Marcas
                </h4>
                {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedFilters.brand && (
                <div className="catpage-filter-content">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="catpage-filter-option">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="catpage-option-text">{brand}</span>
                      <span className="catpage-option-count">({products.filter((p) => p.marca === brand).length})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {currentCategory.features.length > 0 && (
            <div className="catpage-filter-section">
              <div className="catpage-filter-header" onClick={() => toggleFilterSection("features")}>
                <h4>
                  <SlidersHorizontal size={16} />
                  Características
                </h4>
                {expandedFilters.features ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedFilters.features && (
                <div className="catpage-filter-content">
                  {currentCategory.features.map((feature) => (
                    <div key={feature} className="catpage-feature-item">
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Products Section */}
        <main className="catpage-products-section">
          {/* Controls */}
          <div className="catpage-products-controls">
            <div className="catpage-controls-left">
              <h2 className="catpage-results-title">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
                {filteredProducts.length !== 1 ? "s" : ""}
              </h2>
              {(searchTerm || selectedBrands.length > 0) && (
                <div className="catpage-active-filters">
                  {searchTerm && (
                    <span className="catpage-filter-tag">
                      Búsqueda: "{searchTerm}"
                      <button onClick={() => setSearchTerm("")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedBrands.map((brand) => (
                    <span key={brand} className="catpage-filter-tag">
                      {brand}
                      <button onClick={() => toggleBrand(brand)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="catpage-controls-right">
              <div className="catpage-view-controls">
                <button
                  className={`catpage-view-btn ${viewMode === "grid" ? "catpage-view-active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`catpage-view-btn ${viewMode === "list" ? "catpage-view-active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="catpage-sort-select">
                <option value="popularity">Más populares</option>
                <option value="newest">Más recientes</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="rating">Mejor calificados</option>
                <option value="name">Nombre A-Z</option>
              </select>

              <button className="catpage-mobile-filters-btn" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={16} />
                Filtros
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <div className="catpage-no-products">
              <div className="catpage-no-products-icon">🔍</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros o buscar con otros términos</p>
              <button onClick={clearFilters} className="catpage-clear-filters-btn">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className={`catpage-products-grid catpage-view-${viewMode}`}>
                {currentProducts.map((product) => (
                  <ProductCard key={product.idProducto} product={product} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="catpage-pagination">
                  <button
                    className="catpage-pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          className={`catpage-pagination-btn ${page === currentPage ? "catpage-pagination-active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="catpage-pagination-dots">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}

                  <button
                    className="catpage-pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {showFilters && <div className="catpage-mobile-overlay" onClick={() => setShowFilters(false)} />}
    </div>
  )
}

export default CategoryPage
