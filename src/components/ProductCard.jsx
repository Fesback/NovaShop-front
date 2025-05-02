import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {  
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.imagenUrl ? (
          <img src={product.imagenUrl} alt={product.nombre} />
        ) : (
          <div className="image-placeholder">
            🖼️ Imagen no disponible
          </div>
        )}
      </div>
      <div className="product-details">
        <h3>{product.nombre}</h3>
        <p className="product-price">${product.precio}</p>
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}