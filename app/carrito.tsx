interface GenericCartProps<T> {
  items: T[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  getPrice: (item: T) => number;
  getId: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
  title?: string;
}

export function GenericCart<T>({
  items,
  onRemove,
  onUpdateQuantity,
  getPrice,
  getId,
  renderItem,
  title = "Carrito",
}: GenericCartProps<T>) {
  if (items.length === 0) return null;

  // Group items by ID to calculate quantities
  const itemCounts = items.reduce((acc, item) => {
    const id = getId(item);
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  // Get unique items for display
  const uniqueItems = items.filter(
    (item, index, self) =>
      index === self.findIndex((i) => getId(i) === getId(item))
  );

  const total = items.reduce((acc, item) => acc + getPrice(item), 0);

  return (
    <div className="carrito-panel p-3 bg-light border rounded mt-3">
      <h5 className="mb-3">{title}</h5>

      {uniqueItems.map((item) => {
        const id = getId(item);
        const quantity = itemCounts[id];
        const itemIndex = items.findIndex((i) => getId(i) === id);

        return (
          <div
            key={id}
            className="carrito-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
          >
            <div className="d-flex align-items-center flex-grow-1">
              <div className="me-3">
                <span className="badge bg-primary rounded-pill">
                  {quantity}
                </span>
              </div>
              <div className="flex-grow-1">{renderItem(item)}</div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Quantity controls */}
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => onUpdateQuantity(itemIndex, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="btn btn-outline-secondary disabled">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => onUpdateQuantity(itemIndex, quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onRemove(itemIndex)}
                className="btn btn-sm btn-danger ms-2"
                title="Eliminar todos"
              >
                X
              </button>
            </div>
          </div>
        );
      })}

      <div className="mt-3 pt-2 border-top">
        <p className="mb-0">
          <strong>Total ({items.length} items):</strong> $
          {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
