import './Modal.css';

export default function PagoModal({ pedido, onPagoCompleted }) {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  // función para obtener los productos por sus IDs
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // petición para obtener los productos
        const response = await fetch(`http://localhost:8083/api/productos?ids=${pedido.productosIds.join(',')}`);
        const data = await response.json();

        // estado local de los productos
        setProductos(data);

        // cálculo del total sumando los precios de los productos
        const totalPrice = data.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);
        setTotal(totalPrice);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    if (pedido.productosIds && pedido.productosIds.length > 0) {
      fetchProductos();
    }
  }, [pedido.productosIds]);


  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Resumen de pago</h3>
        <p>Categoría: {pedido.categoria}</p>
        <p>Proveedor: {pedido.proveedorId}</p>
        <p>Productos seleccionados: {pedido.productosIds.join(', ')}</p>
        <div>
          <h4>Detalles de los productos:</h4>
          <ul>
            {productos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - {producto.precio}€
              </li>
            ))}
          </ul>
        </div>
        <p>Total: {total.toFixed(2)}€</p>
        <button onClick={onPagoCompleted}>Pagar</button>
      </div>
    </div>
  );
}
