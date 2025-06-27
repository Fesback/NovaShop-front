"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/PaymentConfirmation.css"

const PaymentConfirmation = () => {
  const [pedidoId, setPedidoId] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { montoTotal, items } = location.state || {}

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const idFromParams = queryParams.get("pedidoId")

    if (idFromParams) {
      setPedidoId(idFromParams)
    } else if (location.state?.pedidoId) {
      navigate(`?pedidoId=${location.state.pedidoId}`, {
        replace: true,
        state: location.state,
      })
      setPedidoId(location.state.pedidoId)
    }

      if (location.state?.email && (idFromParams || location.state?.pedidoId)) {
      const enviarCorreoConAdjunto = async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.post("http://localhost:8082/api/notificaciones/correo-adjunto", {
            correo: location.state.email,
            asunto: "Gracias por tu compra",
            mensaje: "Adjuntamos la boleta de tu compra",
            pedidoId: idFromParams || location.state.pedidoId,
            token: token
          })

          console.log("📧 Correo enviado correctamente")
        } catch (error) {
          console.error("❌ Error al enviar correo:", error)
        }
      }

      enviarCorreoConAdjunto()
    }

  }, [location, navigate])

  const handleDownloadPDF = async () => {
    try {
      // Validación extrema del ID
      if (!pedidoId || !/^\d+$/.test(pedidoId)) {
        alert("🆔 ID corrupto! Contactar a soporte")
        return
      }

      // Verificación de token con auto-redirección
      const token = localStorage.getItem("token")
      if (!token) {
        localStorage.removeItem("token")
        navigate("/login?redirect=payment")
        return
      }

      // Debugging profundo
      console.debug("⚙️ Parámetros técnicos:", {
        pedidoId: Number(pedidoId),
        tokenHash: btoa(token.slice(10, 20)), // Hash parcial seguro
      })

      const response = await axios.get(`http://localhost:8081/api/facturacion/boleta/${pedidoId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store, max-age=0",
          "X-Force-Download": "true", // Header personalizado para backend
        },
        timeout: 15000, // 15 segundos máximo
      })

      // Validación de tipo MIME estricta
      if (!response.headers["content-type"]?.includes("pdf")) {
        throw new Error(`🚫 Formato inválido: ${response.headers["content-type"]}`)
      }

      // Mecanismo de descarga híbrido
      const blob = new Blob([response.data], { type: "application/pdf" })
      const downloadUrl = window.URL.createObjectURL(blob)

      // Método 1: Iframe para Chrome/Firefox
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.src = downloadUrl
      document.body.appendChild(iframe)

      // Método 2: Enlace tradicional para Safari/Edge
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = `boleta_${pedidoId}_${Date.now()}.pdf`
        link.click()

        // Limpieza agresiva
        window.URL.revokeObjectURL(downloadUrl)
        iframe.remove()
        link.remove()
      }, 1000)
    } catch (error) {
      // Sistema de diagnóstico avanzado
      console.error("💥 Error catastrófico:", {
        error,
        networkStatus: navigator.onLine ? "online" : "offline",
        lastPedido: localStorage.getItem("lastPedido"),
      })

      let errorDetails = ""
      if (error.response) {
        errorDetails = `Código: ${error.response.status}\nHeaders: ${JSON.stringify(error.response.headers)}`
      } else if (error.request) {
        errorDetails = "El servidor no respondió después de 15 segundos"
      }

      alert(`🚨 FALLA CRÍTICA\n${errorDetails}`)
    }
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-header">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className="success-title">Transacción Completada</h1>
          <p className="success-subtitle">Tu pedido ha sido procesado exitosamente</p>
        </div>

        <div className="order-summary">
          <div className="order-header">
            <h2 className="order-title">Resumen del Pedido</h2>
            <div className="order-number">
              <span className="order-label">Pedido</span>
              <span className="order-id">#{(pedidoId || "0000").padStart(4, "0")}</span>
            </div>
          </div>

          <div className="items-container">
            {items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-details">
                  <h3 className="item-name">{item.nombreProducto}</h3>
                  <div className="item-meta">
                    <span className="item-quantity">Cantidad: {item.cantidad}</span>
                    <span className="item-price">S/. {item.precioUnitario.toFixed(2)} c/u</span>
                  </div>
                </div>
                <div className="item-total">S/. {(item.precioUnitario * item.cantidad).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span className="total-label">Total a Pagar</span>
              <span className="total-amount">S/. {montoTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="download-button"
            onClick={handleDownloadPDF}
            disabled={!pedidoId}
            aria-label="Descargar comprobante PDF"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Descargar Comprobante
          </button>

          <Link to="/" className="return-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentConfirmation
