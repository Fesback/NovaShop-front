import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsByCategory } from '../services/productService';
import ProductCard from '../components/ProductCard';

function CategoryPage() {
  const { categorySlug } = useParams(); // Ej: 'laptops'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory(categorySlug);
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categorySlug]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="category-page">
      <h2>{categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}</h2>
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.idProducto} product={product} />
          ))}
        </div>
      ) : (
        <p>No hay productos en esta categoría</p>
      )}
    </div>
  );
}

export default CategoryPage;