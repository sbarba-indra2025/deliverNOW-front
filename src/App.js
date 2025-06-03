import './App.css';

import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import OrderForm from './Pages/OrderForm';

function App() {
  const [userData, setUserData] = useState(null);
  const [pedidoActivo, setPedidoActivo] = useState(false);
  const [authError, setAuthError] = useState(false);

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
            setAuthError(false);
          } else {
            console.log("Credenciales incorrectas");
            setAuthError(true);
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
            }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}

      {pedidoActivo && <OrderForm onCancel={handleCancelOrder} />}
    </div>
  );
}

export default App;