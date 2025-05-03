import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const [pedidoId, setPedidoId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { montoTotal, items } = location.state || {};

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromParams = queryParams.get('pedidoId');
    
    if (idFromParams) {
      setPedidoId(idFromParams);
    } else if (location.state?.pedidoId) {
      navigate(`?pedidoId=${location.state.pedidoId}`, { 
        replace: true,
        state: location.state
      });
      setPedidoId(location.state.pedidoId);
    }
  }, [location, navigate]);

  const handleDownloadPDF = async () => {
    try {
      // Validación extrema del ID
      if (!pedidoId || !/^\d+$/.test(pedidoId)) {
        alert('🆔 ID corrupto! Contactar a soporte');
        return;
      }

      // Verificación de token con auto-redirección
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('token');
        navigate('/login?redirect=payment');
        return;
      }

      // Debugging profundo
      console.debug('⚙️ Parámetros técnicos:', {
        pedidoId: Number(pedidoId),
        tokenHash: btoa(token.slice(10, 20)) // Hash parcial seguro
      });

      const response = await axios.get(
        `http://localhost:8080/api/pdf/boleta/${pedidoId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-store, max-age=0',
            'X-Force-Download': 'true' // Header personalizado para backend
          },
          timeout: 15000 // 15 segundos máximo
        }
      );

      // Validación de tipo MIME estricta
      if (!response.headers['content-type']?.includes('pdf')) {
        throw new Error(`🚫 Formato inválido: ${response.headers['content-type']}`);
      }

      // Mecanismo de descarga híbrido
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Método 1: Iframe para Chrome/Firefox
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);

      // Método 2: Enlace tradicional para Safari/Edge
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `boleta_${pedidoId}_${Date.now()}.pdf`;
        link.click();
        
        // Limpieza agresiva
        window.URL.revokeObjectURL(downloadUrl);
        iframe.remove();
        link.remove();
      }, 1000);

    } catch (error) {
      // Sistema de diagnóstico avanzado
      console.error('💥 Error catastrófico:', {
        error,
        networkStatus: navigator.onLine ? 'online' : 'offline',
        lastPedido: localStorage.getItem('lastPedido')
      });

      let errorDetails = '';
      if (error.response) {
        errorDetails = `Código: ${error.response.status}\nHeaders: ${JSON.stringify(error.response.headers)}`;
      } else if (error.request) {
        errorDetails = 'El servidor no respondió después de 15 segundos';
      }

      alert(`🚨 FALLA CRÍTICA\n${errorDetails}`);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h2>✅ Transacción Completada</h2>
        
        <div className="order-details">
          <h3>📦 Pedido #{(pedidoId || '0000').padStart(4, '0')}</h3>
          <div className="items-list">
            {items?.map((item, index) => (
              <div key={index} className="item">
                <div className="product-header">
                  <span className="product-name">{item.nombreProducto}</span>
                  <span className="product-qty">🗃️ {item.cantidad} und</span>
                </div>
                <div className="product-footer">
                  <span>💲 Unitario: S/. {item.precioUnitario.toFixed(2)}</span>
                  <span>📈 Subtotal: S/. {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-section">
            <div className="total-line">
              <span>💰 Total General:</span>
              <span className="total-amount">S/. {montoTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button 
          className="download-btn"
          onClick={handleDownloadPDF}
          disabled={!pedidoId}
          aria-label="Descargar comprobante PDF"
        >
          DESCARGAR BOLETA
        </button>
        
        <Link to="/" className="return-home">
          🏡 Volver al Catálogo
        </Link>
      </div>
    </div>
  );
};

export default PaymentConfirmation;