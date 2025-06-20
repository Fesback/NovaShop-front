import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import UserPanel from "./pages/UserPanel";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import ProductoList from "./pages/admin/productos/ProductoList";
import AgregarProducto from "./pages/admin/productos/AgregarProducto";
import EditarProducto from "./pages/admin/productos/EditarProducto";

//Categorias Publico
import CategoriasPage from "./pages/admin/categorias/CategoriasPage";
import CategoriasDetalle from "./pages/admin/categorias/CategoriasDetalle";

//Categorias ADMIN
import ListarCategorias from "./pages/admin/categorias/ListarCategorias";
import CrearCategoria from "./pages/admin/categorias/CrearCategoria";
import EditarCategoria from "./pages/admin/categorias/EditarCategoria";

//Pedidos ADMIN
import ListarPedidos from "./pages/admin/pedidos/ListarPedidos";
import DetallePedidos from "./pages/admin/pedidos/DetallePedidos";

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
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/categorias/:id" element={<CategoriasDetalle />} />
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

        {/* RUTAS PROTEGIDAS ADMIN CON LAYOUT */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/*  PRODUCTOS del Admin */}
          <Route path="productos/listar" element={<ProductoList />} />
          <Route path="productos/agregar" element={<AgregarProducto />} />
          <Route path="productos/editar/:id" element={<EditarProducto />} />
          {/* CATEGORIAS del Admin */}
          <Route path="categorias/listar" element={<ListarCategorias />} />
          <Route path="categorias/crear" element={<CrearCategoria />} />
          <Route path="categorias/editar/:id" element={<EditarCategoria />} />
          {/* PEDIDOS del Admin */}
          <Route path="pedidos/listar" element={<ListarPedidos />} />
          <Route path="pedidos/detalle/:id" element={<DetallePedidos />} />
        </Route>

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
