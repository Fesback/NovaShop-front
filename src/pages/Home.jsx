import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();
  const categories = [
    { id: 1, name: 'Laptops', icon: '💻', slug: 'laptops' },
    { id: 2, name: 'Tablets', icon: '📱', slug: 'tablets' },
    { id: 3, name: 'Celulares', icon: '📲', slug: 'celulares' },
    { id: 4, name: 'Accesorios', icon: '🎧', slug: 'accesorios' }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Bienvenido a NovaShop</h1>
        <p>Encuentra los mejores productos tecnológicos al mejor precio</p>
      </section>

      {user && (
        <section className="user-welcome">
          <h2>¡Hola de nuevo!</h2>
          <p>¿Qué te gustaría explorar hoy?</p>
        </section>
      )}

    <section className="categories-section">
        <h2>Nuestras Categorías</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              to={`/categoria/${category.slug}`}  // ¡Enlace corregido aquí!
              key={category.id}
              className="category-card"
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>


      <section className="info-section">
        <div className="info-card">
          <h3>Envíos Rápidos</h3>
          <p>Recibe tus productos en 24-48 horas</p>
        </div>
        <div className="info-card">
          <h3>Garantía</h3>
          <p>12 meses de garantía en todos los productos</p>
        </div>
      </section>
    </div>
  );
}

export default Home;