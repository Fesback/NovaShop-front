import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import "../styles/CartPage.css"

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()

  const navigate = useNavigate()

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Tu Carrito de Compras</h1>
          <div className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">Tu carrito está vacío</h3>
            <p className="empty-message">Agrega algunos productos para comenzar</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.idItem} className="cart-item">
                    <div className="item-info">
                      <h4 className="item-name">{item.nombreProducto || "Producto sin nombre"}</h4>
                      <p className="item-price">S/. {Number(item.precioUnitario).toFixed(2)}</p>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.idItem, Math.max(1, item.cantidad - 1))}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.idItem, Number.parseInt(e.target.value) || 1)}
                          className="quantity-input"
                        />
                        <button className="quantity-btn" onClick={() => updateQuantity(item.idItem, item.cantidad + 1)}>
                          +
                        </button>
                      </div>

                      <div className="item-total">S/. {(Number(item.precioUnitario) * item.cantidad).toFixed(2)}</div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.idItem)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-sidebar">
                <div className="cart-summary">
                  <h3 className="summary-title">Resumen del Pedido</h3>

                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>S/. {!isNaN(cartTotal) ? cartTotal.toFixed(2) : "0.00"}</span>
                  </div>

                  <div className="summary-row">
                    <span>Envío:</span>
                    <span>Gratis</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>S/. {!isNaN(cartTotal) ? cartTotal.toFixed(2) : "0.00"}</span>
                  </div>

                  <div className="cart-actions">
                    <button
                      className="checkout-btn"
                      onClick={() => navigate("/checkout")}
                      disabled={cartItems.length === 0}
                    >
                      Proceder al Pago
                    </button>

                    <button className="clear-btn" onClick={clearCart}>
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
