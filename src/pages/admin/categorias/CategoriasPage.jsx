import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/CategoriasPage.css"

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categorias");
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        alert("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <div className="categorias-loading">
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="categorias-page-container">
      <h1 className="categorias-title">Categorías Disponibles</h1>
      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="categoria-card">
            <img
              src={categoria.imagen}
              alt={categoria.nombre}
              className="categoria-imagen"
              onError={(e) => (e.target.src = "/placeholder.png")} // Imagen por defecto
            />
            <h2 className="categoria-nombre">{categoria.nombre}</h2>
            <p className="categoria-descripcion">{categoria.descripcion}</p>
            <button
              className="categoria-boton"
              onClick={() => navigate(`/categorias/${categoria.id}`)}
            >
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriasPage;