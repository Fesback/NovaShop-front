import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error("El carrito guardado no es un array válido.");
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error al parsear el carrito desde localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  const addToCart = async (product) => {
    if (!product?.id) {
      console.error("❌ El producto no tiene ID:", product);
      alert("Error: El producto no tiene un ID válido");
      return;
    }

    if (typeof product.precio !== "number" || product.precio <= 0) {
      console.error("❌ Precio inválido:", product.precio);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para añadir productos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/carrito/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({
          idProducto: product.id,
          cantidad: 1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Respuesta del backend:", data);

      if (Array.isArray(data.items)) {
        setCartItems(data.items);
      } else {
        console.error("❌ Respuesta inesperada del backend:", data);
      }

    } catch (error) {
      console.error("🚨 Error al agregar al carrito:", error);
      alert(error.message);
    }
  };

  const removeFromCart = async (idItem) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carrito/item/${idItem}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });

      if (response.ok) {
        setCartItems(prevItems => prevItems.filter(item => item.idItem !== idItem));
      } else {
        const errorText = await response.text();
        throw new Error(`Error al eliminar: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      alert(error.message);
    }
  };
  
  const updateQuantity = async (idItem, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carrito/item/${idItem}?cantidad=${newQuantity}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        const errorText = await response.text();
        throw new Error(`Error al actualizar: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
      alert(error.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/carrito", {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });

      if (response.ok) {
        setCartItems([]); 
      } else {
        const errorText = await response.text();
        throw new Error(`Error al vaciar: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
      alert(error.message);
    }
  };

  // CÁLCULOS CORREGIDOS
  const cartCount = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + (Number(item.cantidad) || 0), 0) 
    : 0;

  const cartTotal = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => {
        const precio = Number(item.precioUnitario) || 0;
        const cantidad = Number(item.cantidad) || 0;
        return total + (precio * cantidad);
      }, 0) 
    : 0;

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