import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import "../styles/CheckoutPage.css"

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    tarjeta: "",
    expiracion: "",
    cvv: "",
    nombreTarjeta: "",
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Validación de datos personales
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }

    // Validación de dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es requerida"
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal es requerido"
    }

    // Validación de tarjeta
    if (!formData.tarjeta.trim()) {
      newErrors.tarjeta = "El número de tarjeta es requerido"
    } else if (formData.tarjeta.replace(/\s/g, "").length < 16) {
      newErrors.tarjeta = "El número de tarjeta debe tener 16 dígitos"
    }

    if (!formData.expiracion.trim()) {
      newErrors.expiracion = "La fecha de expiración es requerida"
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "El CVV es requerido"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "El CVV debe tener al menos 3 dígitos"
    }

    if (!formData.nombreTarjeta.trim()) {
      newErrors.nombreTarjeta = "El nombre en la tarjeta es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      const token = localStorage.getItem("token")

      const pedidoData = {
        direccionEnvio: `${formData.direccion}, ${formData.ciudad}, ${formData.codigoPostal}`,
        datosPersonales: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
        },
        items: cartItems.map((item) => ({
          productoId: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      }

      const response = await axios.post("http://localhost:8080/api/pedidos", pedidoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const pedidoId = response?.data?.idPedido
      console.log("📦 Pedido creado con ID:", pedidoId)

      if(!pedidoId){
        alert("⚠️ No se recibió el ID del pedido. No se puede continuar")
        return
      }

      clearCart()
      navigate(`/confirmacion-pago?pedidoId=${pedidoId}`, {
        state: {
          pedidoId,
          montoTotal: cartTotal,
          items: cartItems,
          email: formData.email,
        },
      })
    } catch (error) {
      console.error("Error procesando pago:", error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error al procesar el pedido"
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Formatear número de tarjeta
    if (name === "tarjeta") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      setFormData({
        ...formData,
        [name]: formatted,
      })
    }
    // Formatear fecha de expiración
    else if (name === "expiracion") {
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      setFormData({
        ...formData,
        [name]: formatted,
      })
    }
    // Formatear CVV (solo números)
    else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "")
      setFormData({
        ...formData,
        [name]: formatted,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos antes de proceder al checkout</p>
          <button onClick={() => navigate("/productos")} className="continue-shopping-btn">
            Continuar Comprando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        <p>Complete la información para procesar su pedido</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Datos Personales */}
            <div className="form-section">
              <h3>
                <span className="section-number">1</span>
                Información Personal
              </h3>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? "error" : ""}
                  placeholder="Ingrese su nombre completo"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={errors.telefono ? "error" : ""}
                    placeholder="+51 999 999 999"
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="form-section">
              <h3>
                <span className="section-number">2</span>
                Dirección de Envío
              </h3>

              <div className="form-group">
                <label htmlFor="direccion">Dirección Completa *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className={errors.direccion ? "error" : ""}
                  placeholder="Calle, número, distrito"
                />
                {errors.direccion && <span className="error-message">{errors.direccion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className={errors.ciudad ? "error" : ""}
                    placeholder="Lima"
                  />
                  {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className={errors.codigoPostal ? "error" : ""}
                    placeholder="15001"
                  />
                  {errors.codigoPostal && <span className="error-message">{errors.codigoPostal}</span>}
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="form-section">
              <h3>
                <span className="section-number">3</span>
                Información de Pago
              </h3>

              <div className="form-group">
                <label htmlFor="nombreTarjeta">Nombre en la Tarjeta *</label>
                <input
                  type="text"
                  id="nombreTarjeta"
                  name="nombreTarjeta"
                  value={formData.nombreTarjeta}
                  onChange={handleInputChange}
                  className={errors.nombreTarjeta ? "error" : ""}
                  placeholder="Como aparece en la tarjeta"
                />
                {errors.nombreTarjeta && <span className="error-message">{errors.nombreTarjeta}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="tarjeta">Número de Tarjeta *</label>
                <input
                  type="text"
                  id="tarjeta"
                  name="tarjeta"
                  value={formData.tarjeta}
                  onChange={handleInputChange}
                  className={errors.tarjeta ? "error" : ""}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.tarjeta && <span className="error-message">{errors.tarjeta}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiracion">Fecha de Expiración *</label>
                  <input
                    type="text"
                    id="expiracion"
                    name="expiracion"
                    value={formData.expiracion}
                    onChange={handleInputChange}
                    className={errors.expiracion ? "error" : ""}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                  {errors.expiracion && <span className="error-message">{errors.expiracion}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={errors.cvv ? "error" : ""}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`confirm-payment-btn ${isProcessing ? "processing" : ""}`}
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : `Confirmar Pago - S/. ${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Resumen de Compra */}
        <div className="order-summary">
          <div className="summary-header">
            <h3>Resumen de Compra</h3>
          </div>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.idItem} className="summary-item">
                <div className="item-info">
                  <span className="item-name">{item.nombreProducto}</span>
                  <span className="item-quantity">Cantidad: {item.cantidad}</span>
                </div>
                <div className="item-price">
                  <span>S/. {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="subtotal">
              <span>Subtotal:</span>
              <span>S/. {cartTotal.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>S/. {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="security-info">
            <p>🔒 Pago 100% seguro y encriptado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
