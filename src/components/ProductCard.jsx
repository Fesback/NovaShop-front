import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Normaliza el objeto para que tenga un "id" como espera el contexto
    const normalizado = {
      id: product.idProducto || product.id,  // Usa idProducto o id
      nombre: product.nombre,
      precio: product.precio,
      imagenUrl: product.imagenUrl,
    };

    console.log("Producto normalizado:", normalizado);
    addToCart(normalizado);
  };

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
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
