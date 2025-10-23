interface GenericCartProps<T> {
  items: T[];
  onRemove: (index: number) => void;
  getPrice: (item: T) => number; // Cómo obtener el precio
  renderItem: (item: T) => React.ReactNode; // Qué mostrar por ítem
  title?: string; // opcional
}

export function GenericCart<T>({
    items,
    onRemove,
    getPrice,
    renderItem,
    title = "Carrito",
  }: GenericCartProps<T>) {
    if (items.length === 0) return null;

    const total = items.reduce((acc, item) => acc + getPrice(item), 0);

    return (
        <div className="carrito-panel p-3 bg-light border rounded mt-3">
          <h5 className="mb-3">{title}</h5>
    
          {items.map((item, index) => (
            <div
              key={index}
              className="carrito-item d-flex justify-content-between align-items-center mb-2"
            >
              <div>{renderItem(item)}</div>
    
              <button
                onClick={() => onRemove(index)}
                className="btn btn-sm btn-danger ms-2"
              >
                X
              </button>
            </div>
          ))}
    
          <p className="mt-2">
            <strong>Total:</strong> ${total.toLocaleString()}
          </p>
        </div>
      );
    }