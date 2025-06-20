import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/CategoriasDetalle.css';

function CategoriaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/categorias/${id}`);
        setCategoria(response.data);
      } catch (err) {
        console.error("Error al cargar la categoría:", err);
        alert("No se pudo cargar la categoría. Es posible que esté desactivada.");
        navigate("/"); // redirecciona si no se encuentra
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="detalle-loading">
        <p>Cargando detalles de la categoría...</p>
      </div>
    );
  }

  if (!categoria) return null;

  return (
    <div className="categoria-detalle-container">
      <button onClick={() => navigate(-1)} className="volver-btn">← Volver</button>

      <div className="detalle-contenido">
        <img
          src={categoria.imagen}
          alt={categoria.nombre}
          className="detalle-imagen"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <h1 className="detalle-nombre">{categoria.nombre}</h1>
        <p className="detalle-descripcion">{categoria.descripcion}</p>
      </div>
    </div>
  );
}

export default CategoriaDetalle;