import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchProductsByCategoryId } from '../services/productService';
import ProductCard from '../components/ProductCard';

const CATEGORY_IDS = {
  laptops: 1,
  tablets: 2,
  celulares: 3,
  accesorios: 4
};

function CategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);

  const categoryId = CATEGORY_IDS[categorySlug];

  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return; // Evita fetch innecesario
      try {
        const data = await fetchProductsByCategoryId(categoryId);
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    loadProducts();
  }, [categoryId]);

  // Redirige SOLO aquí, no arriba
  if (!categoryId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="category-page">
      <h2>{categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}</h2>
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No hay productos en esta categoría</p>
      )}
    </div>
  );
}

export default CategoryPage;
