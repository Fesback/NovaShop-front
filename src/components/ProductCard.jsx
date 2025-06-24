import { useCart } from "../context/CartContext";
import { useState } from "react"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import "../styles/ProductCard.css"; 

export default function ProductCard({ product, viewMode = "grid" }) {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = () => {
    // Normaliza el objeto para que tenga un "id" como espera el contexto
    const normalizado = {
      id: product.idProducto || product.id, // Usa idProducto o id
      nombre: product.nombre,
      precio: product.precio,
      imagenUrl: product.imagenUrl,
    }

    console.log("Producto normalizado:", normalizado)
    addToCart(normalizado)
  }

  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Generar rating aleatorio para demo (puedes reemplazar con data real)
  const rating = product.rating || (Math.random() * 2 + 3).toFixed(1)
  const reviews = product.reviews || Math.floor(Math.random() * 500 + 50)

  return (
    <div className={`product-card ${viewMode}`}>
      {/* Imagen del producto */}
      <div className="product-image-container">
        {/* Botón de favorito */}
        <button className={`favorite-btn ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Imagen */}
        <div className="image-wrapper">

          {product.imagenUrl && !imageError ? (
            <img
              src={product.imagenUrl || "/placeholder.svg"}
              alt={product.nombre}
              className={`product-image ${imageLoaded ? "loaded" : ""}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="image-placeholder">
              <div className="placeholder-icon">📱</div>
              <span>Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Overlay con acciones rápidas */}
        <div className="product-overlay">
          <button className="quick-action-btn" title="Vista rápida">
            <Eye size={16} />
          </button>
          <button className="quick-action-btn" title="Añadir al carrito" onClick={handleAddToCart}>
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* Badge de descuento (si aplica) */}
        {product.descuento && <div className="discount-badge">-{product.descuento}%</div>}
      </div>

      {/* Detalles del producto */}
      <div className="product-details">
        {/* Marca */}
        {product.marca && <div className="product-brand">{product.marca}</div>}

        {/* Nombre del producto */}
        <h3 className="product-name" title={product.nombre}>
          {product.nombre}
        </h3>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                stroke={i < Math.floor(rating) ? "#fbbf24" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="rating-text">
            {rating} ({reviews})
          </span>
        </div>

        {/* Precio */}
        <div className="product-pricing">
          {product.precioOriginal && product.precioOriginal > product.precio && (
            <span className="original-price">{formatPrice(product.precioOriginal)}</span>
          )}
          <span className="current-price">{formatPrice(product.precio)}</span>
        </div>

        {/* Características destacadas (solo en vista lista) */}
        {viewMode === "list" && product.caracteristicas && (
          <div className="product-features">
            {product.caracteristicas.slice(0, 3).map((feature, index) => (
              <span key={index} className="feature-tag">
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Botón principal */}
        <button className="buy-now-btn" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          <span>Añadir al carrito</span>
        </button>

        {/* Información adicional (solo en vista lista) */}
        {viewMode === "list" && (
          <div className="additional-info">
            <div className="shipping-info">
              <span className="shipping-text">🚚 Envío gratis</span>
            </div>
            {product.stock && (
              <div className="stock-info">
                <span className={`stock-text ${product.stock < 5 ? "low" : ""}`}>
                  {product.stock < 5 ? `Solo ${product.stock} disponibles` : "En stock"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
