import './App.css';

import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import OrderForm from './Pages/OrderForm';
import RepartidorModal from './Pages/RepartidorModal';
import PagoModal from './Pages/PagoModal';
import PedidosModal from './Pages/PedidosModal';

function App() {
  const [userData, setUserData] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [pedidoActivo, setPedidoActivo] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [repartidorModalVisible, setRepartidorModalVisible] = useState(false);
  const [pagoModalVisible, setPagoModalVisible] = useState(false);
  const [pedidosModalVisible, setPedidosModalVisible] = useState(false);

  const handleLogin = ({ username, password }) => {
    setUserData({ username, password });
    setAuthError(false);
  };

  // inicio de sesión
  useEffect(() => {
    if (userData) {
      fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Usuario autenticado correctamente");
            setUsuarioId(data.usuarioId);
            setAuthError(false);
          } else {
            console.log("Credenciales incorrectas");
            setAuthError(true);
            setUsuarioId(null);
            setUserData(null);
          }
        })
        .catch((err) => {
          console.error("Error al hacer login", err);
          setAuthError(true);
        });
    }
  }, [userData])

  const handleCancelOrder = () => {
    setPedidoActivo(false);
    setUserData(null);
    setPedido(null);
    setRepartidorModalVisible(false);
    setPagoModalVisible(false);
  };
  
  const handlePedidoCreated = (nuevoPedido) => {
    setPedido(nuevoPedido);
    setPedidoActivo(false);
    setRepartidorModalVisible(true); // modal de asignación de repartidor
  };

  const handleRepartidorSelected = (repartidor) => {
    // petición para actualizar el pedido con el repartidor seleccionado
    fetch(`http://localhost:8081/api/pedidos/${pedido.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repartidorId: repartidor.id,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setRepartidorModalVisible(false);
      setPagoModalVisible(true); // modal de pago
    })
    .catch((err) => {
      console.error('Error al actualizar el pedido con el repartidor', err);
    });
  };

  const handlePagoCompleted = () => {
    // petición para actualizar el estado del pedido
    fetch(`http://localhost:8081/api/pedidos/${pedido.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estado: "pagado",
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setPagoModalVisible(false);
      alert("Pedido completado con éxito");
      setPedidosModalVisible(true); // modal de consulta de pedidos
    })
    .catch((err) => {
      console.error('Error al actualizar el estado del pedido', err);
    });
  };

  const handleViewPedidos = () => {
    setPedidosModalVisible(true); // modal de consulta de pedidos
  };

  return (
    <div className="main-container">
      {authError && (
        <div className="error-message">Credenciales incorrectas. Intenta nuevamente.</div>
      )}
      {userData ? (
        <div>
          <h2>Bienvenido, {userData.username}!</h2>
          {!pedidoActivo && (
            <button className="start-button" onClick={() => setPedidoActivo(true)}>
              Hacer nuevo pedido
            </button>)
          }
          <button
            className="login-button"
            onClick={() => {
              setUserData(null);
              setPedidoActivo(false);
              setUsuarioId(null);
            }}
          >
            Cerrar sesión
          </button>
          <button
              className="consultar-pedidos-button"
              onClick={handleViewPedidos}
            >
              Consultar pedidos
            </button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}

      {pedidoActivo && <OrderForm onCancel={handleCancelOrder} usuarioId={usuarioId} onPedidoCreated={handlePedidoCreated} />}
      {repartidorModalVisible && <RepartidorModal onRepartidorSelected={handleRepartidorSelected} />}
      {pagoModalVisible && <PagoModal pedido={pedido} onPagoCompleted={handlePagoCompleted} />}
      {pedidosModalVisible && <PedidosModal onClose={() => setPedidosModalVisible(false)} />}
    </div>
  );
}

export default App;