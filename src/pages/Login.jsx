import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        navigate("/");
      } else {
        const errorData = await response.json();
        alert("Error al iniciar sesión: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error durante el inicio de sesión");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}  
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
        <p>
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

export default Login;