import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Footer from "./components/Footer";

// Componente que encapsula las rutas + lógica de ocultar el Navbar
function AppContent() {
  const location = useLocation();

  // Rutas donde NO se mostrará el Navbar
  const hideNavbarRoutes = ["/login", "/register"];
  const hideFooterRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmacion-pago" element={<PaymentConfirmation />} />

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

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
