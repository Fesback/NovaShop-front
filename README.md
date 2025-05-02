# 🛒 Nova Store - Frontend

Bienvenido al repositorio frontend de **Nova Store**, una tienda virtual moderna que permite a usuarios explorar productos, hacer compras y a administradores gestionar el catálogo de manera eficiente.

---

## 🔐 Autenticación y Autorización

- **Login/Registro**: Formularios que envían datos vía `POST` a `/auth/register` o `/auth/login`.
- **JWT Token**: Al autenticarse con éxito, el token se guarda (idealmente en cookies httpOnly o en `localStorage`).
- **Redirección**: Usuarios son redirigidos a su panel o homepage según rol.
- **Estado global**: Datos del usuario se almacenan en Context API o Redux.
- **Rutas protegidas**:
  - `PrivateRoute` para proteger rutas como `/carrito`, `/pedidos` y `/admin`.
  - Se ocultan o muestran elementos del Navbar y la UI según el rol (`USER` o `ADMIN`).
  - Tokens expirados detectan error 401 y redirigen automáticamente al login.

---

## 🛍️ Módulos de la Aplicación

### 1. 🏠 Home Page (público general)
- 4 Cards grandes con las categorías principales: **Laptops**, **Tablets**, **Celulares**, **Accesorios**.
- Navbar con botones condicionales de **Login/Registro**.
- Footer general.

### 2. 🗂️ Página de Categoría
- Cards de productos con imagen, nombre y precio.
- Filtros: categoría, precio, nombre.
- Sidebar colapsable + paginación.

### 3. 🔍 Detalle del Producto
- Imagen destacada + galería.
- Descripción corta y larga.
- Selector de cantidad.
- Botón "Agregar al carrito" (requiere sesión iniciada).

---

## 🛒 Carrito de Compras (solo logueados)
- Icono con contador dinámico.
- Página dedicada:
  - Lista de productos.
  - Subtotal, impuestos y total.
  - Validación de stock en tiempo real.
  - Botón "Pagar".

---

## 💳 Proceso de Pago
- Formulario con campos: nombre, dirección, etc.
- Resumen del pedido.
- Botón de confirmación.
- Página de éxito con descarga de **boleta PDF**.

---

## 📦 Pedidos (usuarios)
- Historial personal con estados: `Pendiente`, `Enviado`, `Entregado`.
- Filtros por estado o fecha.
- Descarga de boleta.
- (Opcional) Seguimiento vía mapa.

---

## 🛠️ Dashboard de Administración (rol ADMIN)
- Estadísticas generales.
- Gestión de productos:
  - Tabla editable con validaciones.
- Gestión de categorías:
  - CRUD básico.
- Gestión de pedidos:
  - Cambios de estado por drag & drop.
  - Vista detallada con generación de boletas.

---

## 🔄 Estado Global y Persistencia
- **Carrito**: sincronizado con el backend, guardado en `localStorage`.
- **Usuario**: mantiene JWT, perfil y rol persistente.
- **Pedidos**: se pueden cachear para mejorar rendimiento.

---

## 🚨 Seguridad y Manejo de Errores
- Formularios con mensajes claros.
- Uso de toasts para feedback inmediato.
- Redirecciones automáticas para errores: `401`, `403`, `404`, `500`.
- Protección XSS y CSRF si se usa `localStorage`.

---

## 🧩 Buenas Prácticas UI
- Componentes reutilizables: cards, botones, inputs, modales.
- Responsive Design: 📱 primero mobile.
- Lazy loading para imágenes y listados.
- Prefetching al hacer hover sobre productos.

---

## 🧭 Flujo de Usuario

| Rol       | Acciones Posibles                                                                 |
|-----------|-----------------------------------------------------------------------------------|
| Invitado  | Navega productos, explora categorías, ve detalles.                              |
| Usuario   | Agrega al carrito, realiza pagos, revisa historial de pedidos.                  |
| Admin     | Gestiona productos, categorías, pedidos y estadísticas.                         |

---

## 🚀 Tecnologías Usadas

- **React.js**
- **React Router**
- **Context API / Redux** (según implementación)
- **CSS Modules / Tailwind / Styled Components** (según setup)
- **Axios / Fetch API**
- **Vite / Webpack** (dependiendo del bundler)

---

## 📁 Estructura 

```
src/
├── App.jsx 🧭
│   Archivo raíz de la aplicación. Configura rutas y layout principal.
│
├── assets/ 📸
│   Imágenes, íconos y otros recursos estáticos (logos, banners, etc.).
│
├── components/ 🧩
│   Componentes reutilizables en distintas partes de la app:
│   ├── AdminRoute.jsx        🔐 Ruta protegida para administradores.
│   ├── CartIcon.jsx          🛒 Icono del carrito con contador.
│   ├── Navbar.jsx            🧭 Barra de navegación superior.
│   ├── ProductCard.jsx       📦 Card para mostrar productos.
│   ├── ProtectedRoute.jsx    🛡️ Ruta protegida para usuarios logueados.
│   └── UserRoute.jsx         👤 Ruta protegida para usuarios normales.
│
├── context/ 🧠
│   Manejadores de estado global mediante React Context API:
│   ├── AuthContext.jsx       🔐 Manejo de login, logout y sesión del usuario.
│   └── CartContext.jsx       🛒 Control del estado del carrito de compras.
│
├── hooks/ 🪝
│   Custom hooks reutilizables (por ejemplo: `useAuth`, `useFetch`, etc.).
│   (Aquí puedes crear archivos como `useAuth.js`, `useCart.js`, etc.)
│
├── pages/ 📄
│   Vistas principales renderizadas en el router:
│   ├── AdminPanel.jsx        ⚙️ Panel de control del administrador.
│   ├── CategoryPage.jsx      📁 Productos filtrados por categoría.
│   ├── Home.jsx              🏠 Página de inicio.
│   ├── Login.jsx             🔑 Formulario de ingreso.
│   ├── ProductList.jsx       🛍️ Listado de productos (con filtros).
│   ├── Register.jsx          📝 Formulario de registro.
│   └── UserPanel.jsx         👤 Panel de usuario con historial de pedidos.
│
├── services/ 🔧
│   Funciones para consumir APIs:
│   ├── api.js                🌐 Configuración base de Axios.
│   └── productService.js     📦 Funciones para obtener/crear productos.
│
└── styles/ 🎨
    └── global.css            💅 Estilos globales compartidos en toda la app.
```
