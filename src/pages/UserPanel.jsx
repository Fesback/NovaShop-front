import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

function UserPanel() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Log para verificar la decodificación
        console.log("Token decodificado:", decoded);

        // Si el backend no manda "nombre", usamos el correo (sub)
        const correo = decoded.sub || "usuario@correo.com";
        const nombreExtraido = correo.split("@")[0]; // saca la parte antes del @
        const nombreFormateado = nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1);

        setNombre(decoded.nombre || nombreFormateado);
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token del localStorage
    navigate("/login"); // Redirige al login
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Menú lateral */}
      <aside style={{ width: "200px", backgroundColor: "#f0f0f0", padding: "1rem" }}>
        <h3>Menú</h3>
        <ul>
          <li>Inicio</li>
          <li>Perfil</li>
          <li>Mis pedidos</li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Bienvenido, {nombre} 👋</h1>
        <p>Este es tu panel de usuario. Desde aquí podrás acceder a tus funcionalidades.</p>
        
        {/* Botón de Logout */}
        <button onClick={handleLogout} style={{ padding: "10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Cerrar sesión
        </button>
      </main>
    </div>
  );
}

export default UserPanel;

