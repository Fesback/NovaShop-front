import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    direccion: '',
    tarjeta: '**** **** **** 1234',
    expiracion: '12/25',
    cvv: '123'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.direccion.trim()) {
      alert('La dirección de envío es obligatoria');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const pedidoData = {
        direccionEnvio: formData.direccion,
        items: cartItems.map(item => ({
          productoId: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario
        }))
      };

      const response = await axios.post(
        'http://localhost:8080/api/pedidos',
        pedidoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      clearCart();
      navigate(`/confirmacion-pago?pedidoId=${response.data.id}`, {
        state: { 
          pedidoId: response.data.id,
          montoTotal: cartTotal,
          items: cartItems
        }
      });

    } catch (error) {
      console.error('Error procesando pago:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al procesar el pedido';
      alert(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      
      <div className="checkout-content">
        <div className="payment-form">
          <form onSubmit={handleSubmit}>
            <h3>Datos Personales</h3>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              readOnly
            />
            
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
            />

            <h3>Datos de Pago</h3>
            <input
              type="text"
              name="tarjeta"
              value={formData.tarjeta}
              readOnly
            />
            
            <div className="card-details">
              <input
                type="text"
                name="expiracion"
                value={formData.expiracion}
                readOnly
              />
              
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                readOnly
              />
            </div>

            <h3>Datos Reales</h3>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección completa de envío"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              minLength="10"
            />

            <button 
              type="submit" 
              className="confirm-payment-btn"
              disabled={cartItems.length === 0}
            >
              Confirmar Pago de S/. {cartTotal.toFixed(2)}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Resumen de Compra</h3>
          {cartItems.map(item => (
            <div key={item.idItem} className="summary-item">
              <span>{item.nombreProducto}</span>
              <div className="item-details">
                <span>{item.cantidad} x S/. {item.precioUnitario.toFixed(2)}</span>
                <span>S/. {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="total-summary">
            <span>Total:</span>
            <span>S/. {cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;