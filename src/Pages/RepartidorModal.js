import './Modal.css';
import { useState, useEffect } from 'react';

export default function RepartidorModal({ onRepartidorSelected }) {
  const [cp, setCp] = useState(''); // código postal ingresado
  const [repartidores, setRepartidores] = useState([]); // lista de repartidores ordenados
  const [selectedRepartidor, setSelectedRepartidor] = useState(null); // repartidor seleccionado manualmente
  const [showRepartidoresList, setShowRepartidoresList] = useState(false); // mostrar lista de repartidores
  const [isLoading, setIsLoading] = useState(false);

  // función para manejar la selección del código postal
  const handleCpChange = (e) => {
    setCp(e.target.value);
  };

  // función para obtener los repartidores ordenados por proximidad al CP
  useEffect(() => {
    if (cp.length === 5) { // verifica si el CP tiene 5 caracteres
      setIsLoading(true);
      fetch(`http://localhost:8082/api/repartidores?cp=${cp}`) // petición a la API para obtener los repartidores por CP
        .then((res) => res.json())
        .then((data) => {
          setRepartidores(data); // se guardan los repartidores ordenados por proximidad
          setSelectedRepartidor(data[0]); // asignación automática del primer repartidor
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error al obtener los repartidores:', err);
          setIsLoading(false);
        });
    }
  }, [cp]);

  // función para elegir un repartidor manualmente
  const handleManualSelect = (repartidor) => {
    setSelectedRepartidor(repartidor);
    onRepartidorSelected(repartidor);
    setShowRepartidoresList(false); // cerrar la lista de repartidores
  };

  // función para asignar el repartidor automáticamente
  const handleAutoSelect = () => {
    onRepartidorSelected(selectedRepartidor);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Selecciona un repartidor</h3>

        {/* input para el código postal */}
        <div className="cp-container">
          <input
            type="text"
            value={cp}
            onChange={handleCpChange}
            maxLength="5"
            placeholder="Ingresa tu código postal"
            disabled={isLoading}
          />
        </div>

        {/* muestra el repartidor asignado automáticamente */}
        {selectedRepartidor && !showRepartidoresList && (
          <div className="repartidor-assigned">
            <p>Repartidor asignado: {selectedRepartidor.nombre}</p>
            <button onClick={() => setShowRepartidoresList(true)}>
              Elegir manualmente
            </button>
          </div>
        )}

        {/* lista de repartidores si se elige "Elegir manualmente" */}
        {showRepartidoresList && (
          <div className="repartidores-list">
            {isLoading ? (
              <p>Cargando repartidores...</p>
            ) : (
              <ul>
                {repartidores.map((repartidor) => (
                  <li key={repartidor.id} onClick={() => handleManualSelect(repartidor)}>
                    {repartidor.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* botón para asignar repartidor automáticamente */}
        {!showRepartidoresList && (
          <div className="auto-assignment">
            <button onClick={handleAutoSelect} disabled={isLoading}>
              Asignar repartidor automáticamente
            </button>
          </div>
        )}

        <button className="close-btn" onClick={() => onRepartidorSelected(null)}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
