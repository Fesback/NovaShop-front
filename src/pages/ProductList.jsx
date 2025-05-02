import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="product-list-container">
      <h2>Todos nuestros productos</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} // Eliminar espacios invisibles aquí
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;