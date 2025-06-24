import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal } from "lucide-react";
import "../styles/ProductoListUser.css";

function ProductList() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("rating")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const productsPerPage = 9
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    category: true,
    price: true,
    features: false,
  })

  // Categorías principales
  const categories = [
    { id: "all", name: "Todos los productos", count: 0 },
    { id: "laptops", name: "Laptops", count: 0 },
    { id: "celulares", name: "Celulares", count: 0 },
    { id: "tablets", name: "Tablets", count: 0 },
    { id: "accesorios", name: "Accesorios", count: 0 },
  ]

  // Marcas disponibles (simuladas)
  const brands = [
    { id: "apple", name: "Apple", count: 15 },
    { id: "samsung", name: "Samsung", count: 12 },
    { id: "xiaomi", name: "Xiaomi", count: 8 },
    { id: "huawei", name: "Huawei", count: 6 },
    { id: "lenovo", name: "Lenovo", count: 5 },
    { id: "hp", name: "HP", count: 7 },
    { id: "dell", name: "Dell", count: 4 },
    { id: "asus", name: "ASUS", count: 6 },
  ]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts()
        setProducts(allProducts)
        setFilteredProducts(allProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filtrar productos
  useEffect(() => {
    let filtered = [...products]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filtro por marcas
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.some((brand) => product.brand?.toLowerCase().includes(brand.toLowerCase())),
      )
    }

    // Filtro por rango de precio
    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(product.price) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Ordenamiento
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (Number.parseFloat(a.price) || 0) - (Number.parseFloat(b.price) || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (Number.parseFloat(b.price) || 0) - (Number.parseFloat(a.price) || 0))
        break
      case "name":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "rating":
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, searchTerm, selectedCategory, selectedBrands, priceRange, sortBy])

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedBrands([])
    setPriceRange([0, 10000])
    setSortBy("rating")
  }

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pages
  }

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-list-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item">Catalog</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">
          {selectedCategory === "all"
            ? "All Products"
            : categories.find((cat) => cat.id === selectedCategory)?.name || "Products"}
        </span>
      </div>

      <div className="main-content">
        {/* Sidebar de filtros */}
        <aside className={`filters-sidebar ${showMobileFilters ? "mobile-open" : ""}`}>
          <div className="filters-header">
            <h3 className="filters-title">Filtros</h3>
            <button className="clear-filters" onClick={clearAllFilters}>
              Limpiar todo
            </button>
          </div>

          {/* Búsqueda */}
          <div className="filter-section">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="filter-section">
            <div className="filter-header" onClick={() => toggleFilterSection("category")}>
              <h4>Categoría</h4>
              {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.category && (
              <div className="filter-content">
                {categories.map((category) => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                    />
                    <span className="option-text">{category.name}</span>
                    <span className="option-count">({category.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Marcas */}
          <div className="filter-section">
            <div className="filter-header" onClick={() => toggleFilterSection("brand")}>
              <h4>Marca</h4>
              {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.brand && (
              <div className="filter-content">
                {brands.map((brand) => (
                  <label key={brand.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                    />
                    <span className="option-text">{brand.name}</span>
                    <span className="option-count">({brand.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rango de precio */}
          <div className="filter-section">
            <div className="filter-header" onClick={() => toggleFilterSection("price")}>
              <h4>Precio</h4>
              {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.price && (
              <div className="filter-content">
                <div className="price-range">
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                      className="price-input"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 10000])}
                      className="price-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="products-main">
          {/* Header de productos */}
          <div className="products-header">
            <div className="products-info">
              <h2 className="products-title">
                {selectedCategory === "all"
                  ? "Todos nuestros productos"
                  : categories.find((cat) => cat.id === selectedCategory)?.name || "Productos"}
              </h2>
              <p className="products-count">
                Productos seleccionados: <strong>{filteredProducts.length}</strong>
              </p>
            </div>

            <div className="products-controls">
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="rating">Por calificación</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="name">Por nombre</option>
              </select>

              <button className="mobile-filters-btn" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <SlidersHorizontal size={16} />
                Filtros
              </button>
            </div>
          </div>

          {/* Grid de productos */}
          {currentProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros para ver más resultados</p>
              <button onClick={clearAllFilters} className="clear-filters-btn">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className={`products-grid ${viewMode}`}>
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>

              {renderPagination().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${page === currentPage ? "active" : ""} ${page === "..." ? "dots" : ""}`}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Overlay para móvil */}
      {showMobileFilters && <div className="mobile-overlay" onClick={() => setShowMobileFilters(false)} />}
    </div>
  )
}

export default ProductList