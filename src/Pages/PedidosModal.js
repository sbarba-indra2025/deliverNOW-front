import './Modal.css';

export default function PedidosModal({ pedidos, onClose }) {

    // falta petición al back para los datos del pedido

    return (
        <div className="modal">
        <div className="modal-content">
            <h3>Pedidos anteriores</h3>
            <ul>
            {pedidos.map((pedido, index) => (
                <li key={index}>
                <span>Pedido {pedido.id}</span>
                <span>Proveedor: {pedido.proveedorId}</span>
                <span>Productos: {pedido.productos}</span>
                <span>Repartidor: {pedido.repartidorId}</span>
                <span>Estado: {pedido.estado}</span>
                </li>
            ))}
            </ul>
            <button onClick={onClose}>Cerrar</button>
        </div>
        </div>
    );
}
