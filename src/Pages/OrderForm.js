import './OrderForm.css';

import { useState } from 'react';


export default function OrderForm({ onCancel, usuarioId, onPedidoCreated }) {
  const [step, setStep] = useState(1); // pasos del formulario
  const [categoria, setCategoria] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState({});

  // Paso 1: carga proveedores
  const handleCategoriaSelect = () => {
    if (!categoria) return;

    // realiza la petición al backend para obtener proveedores
    fetch(`http://localhost:8081/api/proveedores/${categoria}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProveedores(data);
          setStep(2);  // pasa al siguiente paso del formulario
        })
        .catch((err) => {
          console.error('Error al cargar proveedores', err);
        });
  };

  // Paso 2: carga productos del proveedor seleccionado
  const handleProveedorSelect = () => {
    if (!proveedorSeleccionado) return;

    // realiza la petición al backend para obtener los productos del proveedor seleccionado
    fetch(`http://localhost:8081/api/productos/${proveedorSeleccionado.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setProductos(data);
      setStep(3);  // pasa al siguiente paso del formulario
    })
    .catch((err) => {
      console.error('Error al cargar productos', err);
    });
  };

  const selectorProductos = (producto) => {
    setProductosSeleccionados((prev) => {
      const newSelection = { ...prev };
      if (newSelection[producto.id]) {
        delete newSelection[producto.id];
      } else {
        newSelection[producto.id] = producto;
      }
      return newSelection;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // pedido con los datos seleccionados
    const pedido = {
      categoria,
      proveedorId: proveedorSeleccionado.id,
      productosIds: Object.keys(productosSeleccionados).map((key) => parseInt(key)),
      usuarioId
    };

    // realiza la petición POST al backend para guardar el pedido
    fetch('http://localhost:8081/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    })
    .then((res) => res.json())
    .then((data) => {
      alert('Pedido generado');
      onPedidoCreated(data);
    })
    .catch((err) => {
      console.error('Error al enviar el pedido', err);
    });  
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="order-container">
      <h2>Realiza tu pedido</h2>

      {step === 1 && (
        <div className="step-container">
          <p>Selecciona la categoría:</p>
          <div className="btn-group">
            <button
              className={categoria === 'comida' ? 'active' : ''}
              onClick={() => setCategoria('comida')}
            >
              Comida
            </button>
            <button
              className={categoria === 'supermercado' ? 'active' : ''}
              onClick={() => setCategoria('supermercado')}
            >
              Supermercado
            </button>
          </div>
          <div className="actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancelar</button>
            <button disabled={!categoria} onClick={handleCategoriaSelect}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <p>Selecciona un proveedor:</p>
          <ul className="list">
            {proveedores.map((prov) => (
              <li
                key={prov.id}
                className={proveedorSeleccionado?.id === prov.id ? 'selected' : ''}
                onClick={() => setProveedorSeleccionado(prov)}
              >
                {prov.nombre}
              </li>
            ))}
          </ul>
          <div className="actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancelar</button>
            <button disabled={!proveedorSeleccionado} onClick={handleProveedorSelect}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="step-container">
          <p>Selecciona los productos:</p>
          <ul className="list productos-list">
            {productos.map((prod) => (
              <li key={prod.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!productosSeleccionados[prod.id]}
                    onChange={() => selectorProductos(prod)}
                  />
                  <span className="producto-nombre">{prod.nombre}</span> {prod.precio.toFixed(2)}€
                </label>
              </li>
            ))}
          </ul>
          <div className="actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancelar</button>
            <button type="submit" disabled={Object.keys(productosSeleccionados).length === 0}>Finalizar pedido</button>
          </div>
        </form>
      )}
    </div>
  );
}
