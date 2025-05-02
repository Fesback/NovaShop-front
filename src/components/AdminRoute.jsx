import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.authorities || [];

    if (roles.includes("ROLE_ADMIN")) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/login" />;
  }
}

export default AdminRoute;
