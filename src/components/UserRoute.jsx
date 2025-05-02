import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function UserRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.authorities || [];

    // Log para verificar si los roles están correctamente extraídos
    console.log("Roles del usuario:", roles);

    if (roles.includes("ROLE_USER")) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/login" />;
  }
}

export default UserRoute;
