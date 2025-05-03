import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal
  } = useCart();
  
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Tu carrito de compras</h2>

      {cartItems.length === 0 ? (
        <p className="empty-message">Tu carrito está vacío 😢</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.idItem}>
                  <td>{item.nombreProducto || "Producto sin nombre"}</td>
                  <td>S/. {Number(item.precioUnitario).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateQuantity(item.idItem, parseInt(e.target.value) || 1)
                      }
                    />
                  </td>
                  <td>S/. {(Number(item.precioUnitario) * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.idItem)}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Total: S/. {!isNaN(cartTotal) ? cartTotal.toFixed(2) : "0.00"}</h3>
            <div className="cart-actions">
              <button className="clear-btn" onClick={clearCart}>
                Vaciar Carrito
              </button>
              <button 
                className="checkout-btn" 
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;