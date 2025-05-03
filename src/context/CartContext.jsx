import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Asegúrate de que sea un array

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Verifica si parsedCart es un array antes de establecerlo
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error("El carrito guardado no es un array válido.");
          setCartItems([]); // O manejar de otro modo si no es un array
        }
      } catch (error) {
        console.error("Error al parsear el carrito desde localStorage:", error);
        setCartItems([]); // O manejar de otro modo si hay un error en el parseo
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  
  const addToCart = async (product) => {
    // 1. Validar que el producto tenga ID
    if (!product?.id) {
      console.error("❌ El producto no tiene ID:", product);
      alert("Error: El producto no tiene un ID válido");
      return;
    }
  
    // 2. Validar precio
    if (typeof product.precio !== "number" || product.precio <= 0) {
      console.error("❌ Precio inválido:", product.precio);
      return;
    }
  
    // 3. Verificar token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para añadir productos");
      return;
    }
  
    try {
      // 4. Log para verificar el ID
      console.log("🛒 Enviando producto al carrito. ID:", product.id, "Cuerpo completo:", product);
  
      const response = await fetch("http://localhost:8080/api/carrito/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProducto: product.id, // ✅ Asegúrate de que product.id sea un número
          cantidad: 1,
        }),
      });
  
      // 5. Manejar errores HTTP
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      // 6. Procesar respuesta
      const data = await response.json();
console.log("✅ Respuesta del backend:", data);

if (Array.isArray(data.items)) {
  setCartItems(data.items); // ✅ Solo los items del carrito
} else {
  console.error("❌ Respuesta inesperada del backend:", data);
}
  
    } catch (error) {
      console.error("🚨 Error al agregar al carrito:", error);
      alert(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carrito/item/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
      } else {
        console.error("Error al eliminar del carrito:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/carrito/item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProducto: productId,
          cantidad: newQuantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
      } else {
        console.error("Error al actualizar la cantidad:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/carrito", {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems([]);
      } else {
        console.error("Error al vaciar el carrito:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  };

  const cartCount = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (item.cantidad || 0), 0) : 0;
  const cartTotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

