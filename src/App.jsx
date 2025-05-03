import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Importar el CartProvider
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage"; // ✅ Importar CartPage

function App() {
  return (
    <BrowserRouter>
      <CartProvider> {/* Aquí envolvemos toda la app con el CartProvider */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} /> {/* Ruta del carrito */}

          {/* Rutas protegidas */}
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
